using System;
using System.Collections.Specialized;
using System.IO;
using System.Web;
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
				|| StringComparer.InvariantCultureIgnoreCase.Compare(Path.GetExtension(Page.Request.Path), ".aspx") != 0
				|| StateInfoConfig.Dialogs == null)
				return base.DeterminePostBackMode();
			StateContext.StateKey = HttpContext.Current.Request.QueryString[StateContext.STATE];
			if (StateContext.StateKey == null)
			{
				Dialog dialog;
				for (int i = 0; i < StateInfoConfig.Dialogs.Count; i++)
				{
					dialog = StateInfoConfig.Dialogs[i];
					if (dialog.Path.Length != 0 && StringComparer.InvariantCultureIgnoreCase.Compare(Page.Request.AppRelativeCurrentExecutionFilePath, dialog.Path) == 0)
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

			if (Page.PreviousPage == null)
			{
				if (StateContext.State.Page != HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath)
				{
					throw new UrlException(Resources.InvalidUrl);
				}
			}
			Page.PreInit += Page_PreInit;
			Page.PreLoad += Page_PreLoad;
			return base.DeterminePostBackMode();
		}

		private void Page_PreInit(object sender, EventArgs e)
		{
			if (StateContext.State.Masters.Count != 0)
			{
				Page.MasterPageFile = StateContext.State.Masters[0];
				Page.Master.ID = "m";
				MasterPage master = Page.Master;
				for (int i = 1; i < StateContext.State.Masters.Count; i++)
				{
					master.MasterPageFile = StateContext.State.Masters[i];
					master.Master.ID = "m";
					master = master.Master;
				}
			}
			if (StateContext.State.Theme.Length != 0)
			{
				Page.Theme = StateContext.State.Theme;
			}
			Page.RegisterRequiresControlState(Page);
		}

		private void Page_PreLoad(object sender, EventArgs e)
		{
			if (!Page.IsPostBack)
			{
				StateController.ParseData(StateContext.ShieldDecode(HttpContext.Current.Request.QueryString, false));
			}
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
