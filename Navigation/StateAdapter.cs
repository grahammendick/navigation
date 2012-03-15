using System;
using System.Collections.Specialized;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.Adapters;
using Navigation.Properties;

namespace Navigation
{
	/// <summary>
	/// Plugs the navigation framework into the ASP.NET <see cref="System.Web.UI.Page"/> processing
	/// and must be configured as the <see cref="System.Web.UI.Adapters.PageAdapter"/> in the
	/// Browser.config file. This class is not used in a Unit Test environment.
	/// </summary>
	public class StateAdapter : PageAdapter
	{
		/// <summary>
		/// Validates the incoming Url and if no state parameter c0 found will navigate to
		/// the <see cref="Navigation.Dialog"/> whose path property matches the Url
		/// </summary>
		/// <returns>A <see cref="System.Collections.Specialized.NameValueCollection"/> of the 
		/// postback variables, if any; otherwise null</returns>
		/// <exception cref="Navigation.UrlException">There is no query string state parameter, c0, and
		/// the Url does not match the path of any <see cref="Navigation.Dialog"/>; the page of 
		/// the <see cref="Navigation.State"/> does not match the Url path</exception>
		public override NameValueCollection DeterminePostBackMode()
		{
			if (StringComparer.InvariantCultureIgnoreCase.Compare(Page.Request.Path, FormsAuthentication.LoginUrl) == 0
				|| !HttpContext.Current.Handler.GetType().IsSubclassOf(typeof(Page))
				|| StateInfoConfig.Dialogs == null)
				return base.DeterminePostBackMode();
			StateContext.StateKey = Page.Request.QueryString[StateContext.STATE] ?? (string)Page.RouteData.DataTokens[StateContext.STATE];
			if (StateContext.StateKey == null)
			{
				Dialog dialog;
				for (int i = 0; i < StateInfoConfig.Dialogs.Count; i++)
				{
					dialog = StateInfoConfig.Dialogs[i];
					if (dialog.Path.Length != 0 && StringComparer.InvariantCultureIgnoreCase.Compare(Page.AppRelativeVirtualPath, dialog.Path) == 0)
					{
						NavigationData data = new NavigationData();
						foreach (string key in Page.Request.QueryString)
							data.Add(key, Page.Request.QueryString[key]);
						StateController.Navigate(dialog.Key, data);
					}
				}
				throw new UrlException(Resources.InvalidUrl);
			}
			if (StateContext.State == null)
			{
				StateContext.StateKey = null;
				throw new UrlException(Resources.InvalidUrl);
			}
			if (StringComparer.InvariantCultureIgnoreCase.Compare(StateContext.State.Page, Page.AppRelativeVirtualPath) != 0
				&& StringComparer.InvariantCultureIgnoreCase.Compare(StateContext.State.MobilePage, Page.AppRelativeVirtualPath) != 0)
			{
				throw new UrlException(Resources.InvalidUrl);
			}
			Page.PreInit += Page_PreInit;
			return base.DeterminePostBackMode();
		}

		private void Page_PreInit(object sender, EventArgs e)
		{
			StateController.ParseData(StateContext.ShieldDecode(StateController.QueryData, false), Page.IsPostBack);
			bool mobile;
			if (!Page.IsPostBack)
			{
				mobile = Page.Request.Browser.IsMobileDevice;
				Route route = Page.RouteData.Route as Route;
				if ((route == null && (StateContext.State.GetRoute(mobile).Length != 0 && RouteTable.Routes[StateContext.State.GetRouteName(mobile)] != null))
					|| (route != null && StringComparer.InvariantCultureIgnoreCase.Compare(StateContext.State.GetRoute(mobile), route.Url) != 0)
					|| StringComparer.InvariantCultureIgnoreCase.Compare(StateContext.State.GetPage(mobile), Page.AppRelativeVirtualPath) != 0)
					StateController.Refresh(new NavigationData(true));
				if (mobile)
					Page.ClientScript.RegisterHiddenField(StateContext.MOBILE, string.Empty);
			}
			else
			{
				mobile = Page.Request.Form[StateContext.MOBILE] != null;
			}
			if (StateContext.State.GetMasters(mobile).Count != 0)
			{
				Page.MasterPageFile = StateContext.State.GetMasters(mobile)[0];
				Page.Master.ID = "m";
				MasterPage master = Page.Master;
				for (int i = 1; i < StateContext.State.GetMasters(mobile).Count; i++)
				{
					master.MasterPageFile = StateContext.State.GetMasters(mobile)[i];
					master.Master.ID = "m";
					master = master.Master;
				}
			}
			if (StateContext.State.GetTheme(mobile).Length != 0)
			{
				Page.Theme = StateContext.State.GetTheme(mobile);
			}
			Page.RegisterRequiresControlState(Page);
			if (StateContext.State.Title.Length != 0)
				Page.Title = HttpUtility.HtmlEncode(StateContext.State.Title);
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
