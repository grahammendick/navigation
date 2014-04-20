using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
#if NET40Plus
using System.Web.Routing;
#endif
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.Adapters;

namespace Navigation
{
	/// <summary>
	/// Plugs the navigation framework into the ASP.NET <see cref="System.Web.UI.Page"/> processing
	/// and must be configured as the <see cref="System.Web.UI.Adapters.PageAdapter"/> in the
	/// Browser.config file. This class is not used in a Unit Test environment
	/// </summary>
	public class StateAdapter : PageAdapter
	{
		private static Dictionary<string, Dialog> _DialogPaths;

		static StateAdapter()
		{
			_DialogPaths = new Dictionary<string, Dialog>();
			if (StateInfoConfig.Dialogs != null)
			{
				foreach (Dialog dialog in StateInfoConfig.Dialogs)
				{
					if (dialog.Path.Length != 0)
						_DialogPaths[dialog.Path.ToUpperInvariant()] = dialog;
				}
			}
		}

		/// <summary>
		/// Validates the incoming Url and if no <see cref="Navigation.NavigationSettings.StateIdKey"/> 
		/// found will navigate to the <see cref="Navigation.Dialog"/> whose path property matches the Url
		/// </summary>
		/// <returns>A <see cref="System.Collections.Specialized.NameValueCollection"/> of the 
		/// postback variables, if any; otherwise null</returns>
		/// <exception cref="Navigation.UrlException">The <see cref="Navigation.NavigationSettings.StateIdKey"/>
		/// is not found and the Url does not match the path of any <see cref="Navigation.Dialog"/>; the page of 
		/// the <see cref="Navigation.State"/> does not match the Url path</exception>
		public override NameValueCollection DeterminePostBackMode()
		{
			if (IsLogin() || !HttpContext.Current.Handler.GetType().IsSubclassOf(typeof(Page))
				|| StateInfoConfig.Dialogs == null || StateInfoConfig.Dialogs.Count == 0)
				return base.DeterminePostBackMode();
#if NET40Plus
			StateContext.StateId = Page.Request.QueryString[NavigationSettings.Config.StateIdKey] ?? (string)Page.RouteData.DataTokens[NavigationSettings.Config.StateIdKey];
#else
			StateContext.StateId = Page.Request.QueryString[NavigationSettings.Config.StateIdKey];
#endif
			if (StateContext.StateId == null)
			{
				if (_DialogPaths.ContainsKey(Page.AppRelativeVirtualPath.ToUpperInvariant()))
				{
					NavigationData data = new NavigationData();
					foreach (string key in Page.Request.QueryString)
						data.Add(key, Page.Request.QueryString[key]);
					StateController.Navigate(_DialogPaths[Page.AppRelativeVirtualPath.ToUpperInvariant()].Key, data);
				}
				throw new UrlException(Resources.InvalidUrl);
			}
			if (StateContext.State == null)
			{
				StateContext.StateId = null;
				throw new UrlException(Resources.InvalidUrl);
			}
#if NET40Plus
			Route route = Page.RouteData.Route as Route;
			if (StringComparer.OrdinalIgnoreCase.Compare(StateContext.State.Page, Page.AppRelativeVirtualPath) != 0
				&& StringComparer.OrdinalIgnoreCase.Compare(StateContext.State.MobilePage, Page.AppRelativeVirtualPath) != 0
				&& (route == null || StringComparer.OrdinalIgnoreCase.Compare(StateContext.State.Route, route.Url) != 0))
#else
			if (StringComparer.OrdinalIgnoreCase.Compare(StateContext.State.Page, Page.AppRelativeVirtualPath) != 0
				&& StringComparer.OrdinalIgnoreCase.Compare(StateContext.State.MobilePage, Page.AppRelativeVirtualPath) != 0)
#endif
			{
				throw new UrlException(Resources.InvalidUrl);
			}
			Page.PreInit += Page_PreInit;
			return base.DeterminePostBackMode();
		}

		private void Page_PreInit(object sender, EventArgs e)
		{
#if NET40Plus
			StateController.SetStateContext(new HttpContextWrapper(HttpContext.Current));
#else
			StateController.SetStateContext(HttpContext.Current.Request.QueryString);
#endif
			if (Page.IsPostBack)
				StateContext.Data.Clear();
#if NET45Plus
			StateRouteHandler stateRouteHandler = Page.RouteData.RouteHandler as StateRouteHandler;
			if (stateRouteHandler == null)
				stateRouteHandler = new StateRouteHandler();
			StateDisplayInfo stateDisplayInfo = stateRouteHandler.SetPageStateDisplay(Page, StateContext.State);
#else
			StateDisplayInfo stateDisplayInfo = StateRouteHandler.SetPageStateDisplay(Page, StateContext.State);
#endif
			if (!Page.IsPostBack && !IsConsistent(stateDisplayInfo))
				StateController.Refresh(new NavigationData(true));
			Page.ClientScript.RegisterHiddenField(StateRouteHandler.DISPLAY_MODES, HttpUtility.HtmlEncode(stateDisplayInfo.DisplayModes));
			Page.RegisterRequiresControlState(Page);
			if (StateContext.State.Title.Length != 0)
				Page.Title = HttpUtility.HtmlEncode(StateContext.State.Title);
		}

		private bool IsLogin()
		{
			string loginPath = FormsAuthentication.LoginUrl;
			if (NavigationSettings.Config.LoginPath.Length != 0)
				loginPath = NavigationSettings.Config.LoginPath;
			if (StringComparer.OrdinalIgnoreCase.Compare(Page.Request.Path, loginPath) == 0)
			{
				StateContext.Data[NavigationSettings.Config.ReturnUrlKey] = Page.Request.QueryString[NavigationSettings.Config.ReturnUrlKey];
				return true;
			}
			return false;
		}

		private bool IsConsistent(StateDisplayInfo stateDisplayInfo)
		{
#if NET40Plus
			Route route = Page.RouteData.Route as Route;
			if ((route == null && (stateDisplayInfo.Route.Length != 0 && RouteTable.Routes[stateDisplayInfo.RouteName] != null))
				|| (route != null && StringComparer.OrdinalIgnoreCase.Compare(stateDisplayInfo.Route, route.Url) != 0)
				|| StringComparer.OrdinalIgnoreCase.Compare(stateDisplayInfo.Page, Page.AppRelativeVirtualPath) != 0)
				return false;
#else
			if (StringComparer.OrdinalIgnoreCase.Compare(stateDisplayInfo.Page, Page.AppRelativeVirtualPath) != 0)
				return false;
#endif
			return true;
		}

		/// <summary>
		/// Loads <see cref="Navigation.StateContext.Data">Context Data</see>
		/// saved by <see cref="SaveAdapterControlState"/> during a previous request
		/// </summary>
		/// <param name="state">The <see cref="Navigation.StateContext"/> data</param>
		protected override void LoadAdapterControlState(object state)
		{
			((IStateManager)StateContext.Data).LoadViewState(state);
		}

		/// <summary>
		/// Saves <see cref="Navigation.StateContext.Data">Context Data</see>
		/// so is available across post backs
		/// </summary>
		/// <returns>The <see cref="Navigation.StateContext"/> data</returns>
		protected override object SaveAdapterControlState()
		{
			return ((IStateManager)StateContext.Data).SaveViewState();
		}
	}
}
