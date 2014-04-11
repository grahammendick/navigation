#if NET45Plus
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Hosting;
using System.Web.Routing;
using System.Web.UI;
using System.Web.WebPages;

namespace Navigation
{
	/// <summary>
	/// Allows a <see cref="Navigation.State"/>'s page, masters and theme to be determined
	/// based on the browser, using the Display Modes support provided by ASP.NET.
	/// </summary>
	public class StateRouteHandler : IRouteHandler
	{
		private static readonly object _StateDisplayInfoKey = new object();

		internal StateRouteHandler()
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.StateRouteHandler"/> class
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> this route handler is
		/// associated with</param>
		protected internal StateRouteHandler(State state)
		{
			State = state;
		}

		/// <summary>
		/// Gets the <see cref="Navigation.State"/> this route handler is associated with
		/// </summary>
		public State State
		{
			get;
			private set;
		}

		/// <summary>
		/// Returns the object that processes the request
		/// </summary>
		/// <param name="requestContext">An object that encapsulates information about the request</param>
		/// <returns>The object that processes the request</returns>
		public IHttpHandler GetHttpHandler(RequestContext requestContext)
		{
			if (requestContext == null)
				throw new ArgumentNullException("requestContext");
			StateDisplayInfo stateDisplayInfo;
			string displayModes = HttpUtility.HtmlDecode(requestContext.HttpContext.Request.Form[StateContext.DISPLAY_MODES]);
			if (displayModes == null)
				stateDisplayInfo = GetStateDisplayInfo(requestContext.HttpContext);
			else
				stateDisplayInfo = GetStateDisplayInfo(displayModes, requestContext.HttpContext);
			requestContext.HttpContext.Items[_StateDisplayInfoKey] = stateDisplayInfo;
			return new PageRouteHandler(stateDisplayInfo.Page, State.CheckPhysicalUrlAccess).GetHttpHandler(requestContext);
		}

		private StateDisplayInfo GetStateDisplayInfo(HttpContextBase context)
		{
			StateDisplayInfo stateDisplayInfo = new StateDisplayInfo();
			stateDisplayInfo.IsPostBack = false;
			DisplayInfo displayInfo = GetDisplayInfoForPage(State.Page, context);
			stateDisplayInfo.DisplayMode = displayInfo.DisplayMode;
			stateDisplayInfo.Page = displayInfo.FilePath;
			stateDisplayInfo.DisplayModes = displayInfo.DisplayMode.DisplayModeId;
			stateDisplayInfo.Route = State.Route;
			stateDisplayInfo.RouteName = State.GetRouteName(false);
			stateDisplayInfo.Masters = State.Masters;
			stateDisplayInfo.Theme = State.Theme;
			if (StringComparer.OrdinalIgnoreCase.Compare(State.Page, stateDisplayInfo.Page) != 0)
			{
				stateDisplayInfo.Masters = new ReadOnlyCollection<string>(new string[0]);
				stateDisplayInfo.Theme = string.Empty;
			}
			return stateDisplayInfo;
		}

		private StateDisplayInfo GetStateDisplayInfo(string displayModes, HttpContextBase context)
		{
			StateDisplayInfo stateDisplayInfo = new StateDisplayInfo();
			stateDisplayInfo.IsPostBack = true;
			stateDisplayInfo.Page = State.Page;
			stateDisplayInfo.DisplayModes = displayModes;
			stateDisplayInfo.Route = State.Route;
			stateDisplayInfo.RouteName = State.GetRouteName(false);
			stateDisplayInfo.Masters = State.Masters;
			stateDisplayInfo.Theme = State.Theme;
			string[] displayModeIds = Regex.Split(displayModes, "\\|");
			DisplayInfo displayInfo = new DisplayInfo(State.Page, DisplayModeProvider.Instance.Modes.Where(m => m.DisplayModeId == displayModeIds[0]).First());
			stateDisplayInfo.Page = GetPageForDisplayInfo(displayInfo, context);
			if (StringComparer.OrdinalIgnoreCase.Compare(State.Page, stateDisplayInfo.Page) != 0)
			{
				stateDisplayInfo.Masters = new ReadOnlyCollection<string>(new string[0]);
				stateDisplayInfo.Theme = string.Empty;
			}
			return stateDisplayInfo;
		}

		/// <summary>
		/// Gets the browser specific page and <see cref="System.Web.WebPages.IDisplayMode"/> and is
		/// called when the page first loads
		/// </summary>
		/// <param name="page">The page for the associated <see cref="State"/></param>
		/// <param name="context">The current <see cref="System.Web.HttpContextBase"/></param>
		/// <returns>The browser specific <see cref="System.Web.WebPages.DisplayInfo"/></returns>
		protected virtual DisplayInfo GetDisplayInfoForPage(string page, HttpContextBase context)
		{
			return DisplayModeProvider.Instance.GetDisplayInfoForVirtualPath(page, context, v => HostingEnvironment.VirtualPathProvider.FileExists(v), null);
		}

		/// <summary>
		/// Gets the browser specific page from the given <paramref name="displayInfo"/> and is called
		/// when the page posts back
		/// </summary>
		/// <param name="displayInfo">Contains the page for the associated <see cref="State"/> and the
		/// browser specific <see cref="System.Web.WebPages.IDisplayMode"/></param>
		/// <param name="context">The current <see cref="System.Web.HttpContextBase"/></param>
		/// <returns>The browser specific page</returns>
		protected virtual string GetPageForDisplayInfo(DisplayInfo displayInfo, HttpContextBase context)
		{
			if (displayInfo.DisplayMode.DisplayModeId.Length != 0)
				return displayInfo.FilePath.Substring(0, displayInfo.FilePath.Length - 4) + displayInfo.DisplayMode.DisplayModeId + ".aspx";
			return displayInfo.FilePath;
		}

		private static StateDisplayInfo GetStateDisplayInfo(State state, HttpContextBase context)
		{
			bool mobile;
			string displayModes = HttpUtility.HtmlDecode(context.Request.Form[StateContext.DISPLAY_MODES]);
			StateDisplayInfo stateDisplayInfo = new StateDisplayInfo();
			if (displayModes == null)
			{
				mobile = new HttpContextWrapper(HttpContext.Current).GetOverriddenBrowser().IsMobileDevice;
				if (DisplayModeProvider.Instance.RequireConsistentDisplayMode && (!mobile || state.MobilePage.Length == 0))
					stateDisplayInfo.DisplayMode = DisplayModeProvider.Instance.Modes.Last();
				stateDisplayInfo.DisplayModes = mobile ? "Mobile" : string.Empty;
				stateDisplayInfo.IsPostBack = false;
			}
			else
			{
				mobile = StringComparer.OrdinalIgnoreCase.Compare(Regex.Split(displayModes, "\\|")[0], "Mobile") == 0;
				stateDisplayInfo.DisplayModes = displayModes;
				stateDisplayInfo.IsPostBack = true;
			}
			stateDisplayInfo.Page = state.GetPage(mobile);
			stateDisplayInfo.Route = state.GetRoute(mobile);
			stateDisplayInfo.RouteName = state.GetRouteName(mobile);
			stateDisplayInfo.Masters = state.GetMasters(mobile);
			stateDisplayInfo.Theme = state.GetTheme(mobile);
			return stateDisplayInfo;
		}

		internal StateDisplayInfo SetPageStateDisplay(Page page, State state)
		{
			HttpContextBase context = page.Request.RequestContext.HttpContext;
			StateDisplayInfo stateDisplayInfo = (StateDisplayInfo)context.Items[_StateDisplayInfoKey];
			if (stateDisplayInfo == null || page.RouteData.Route == null)
				stateDisplayInfo = GetStateDisplayInfo(state, context);
			if (stateDisplayInfo.Masters.Count == 0 && !string.IsNullOrEmpty(page.MasterPageFile))
			{
				List<string> masters = new List<string>();
				masters.Add(page.MasterPageFile);
				stateDisplayInfo.Masters = new ReadOnlyCollection<string>(masters);
			}
			if (stateDisplayInfo.Theme.Length == 0 && !string.IsNullOrEmpty(page.Theme))
				stateDisplayInfo.Theme = page.Theme;
			if (!stateDisplayInfo.IsPostBack)
				UpdateStateDisplayInfo(stateDisplayInfo, context, page);
			else
				UpdateStateDisplayInfo(stateDisplayInfo, page, context);
			return stateDisplayInfo;
		}

		private void UpdateStateDisplayInfo(StateDisplayInfo stateDisplayInfo, HttpContextBase context, Page page)
		{
			DisplayInfo displayInfo;
			StringBuilder keyBuilder = new StringBuilder();
			keyBuilder.Append(stateDisplayInfo.DisplayModes);
			MasterPage master = null;
			bool masterSwitch = false;
			if (stateDisplayInfo.Masters.Count != 0)
			{
				displayInfo = GetDisplayInfoForMaster(stateDisplayInfo.Masters[0], stateDisplayInfo.DisplayMode, context);
				keyBuilder.Append("|");
				keyBuilder.Append(displayInfo.DisplayMode.DisplayModeId);
				page.MasterPageFile = displayInfo.FilePath;
				page.Master.ID = "m";
				master = page.Master;
				if (stateDisplayInfo.Masters.Count > 1 && string.IsNullOrEmpty(displayInfo.DisplayMode.DisplayModeId))
					master.MasterPageFile = stateDisplayInfo.Masters[1];
				else
					masterSwitch = true;
			}
			int i = 2;
			while (master != null && !string.IsNullOrEmpty(master.MasterPageFile))
			{
				displayInfo = GetDisplayInfoForMaster(master.MasterPageFile, stateDisplayInfo.DisplayMode, context);
				keyBuilder.Append("|");
				keyBuilder.Append(displayInfo.DisplayMode.DisplayModeId);
				master.MasterPageFile = displayInfo.FilePath;
				master.Master.ID = "m";
				master = master.Master;
				if (!masterSwitch && stateDisplayInfo.Masters.Count > i && string.IsNullOrEmpty(displayInfo.DisplayMode.DisplayModeId))
					master.MasterPageFile = stateDisplayInfo.Masters[i];
				else
					masterSwitch = true;
				i++;
			}
			if (stateDisplayInfo.Theme.Length != 0)
			{
				displayInfo = GetDisplayInfoForTheme(stateDisplayInfo.Theme, stateDisplayInfo.DisplayMode, context);
				keyBuilder.Append("|");
				keyBuilder.Append(displayInfo.DisplayMode.DisplayModeId);
				page.Theme = displayInfo.FilePath;
			}
			stateDisplayInfo.DisplayModes = keyBuilder.ToString();
		}

		private void UpdateStateDisplayInfo(StateDisplayInfo stateDisplayInfo, Page page, HttpContextBase context)
		{
			string[] displayModeIds = Regex.Split(stateDisplayInfo.DisplayModes, "\\|");
			int i = 1;
			MasterPage master = null;
			bool masterSwitch = false;
			DisplayInfo displayInfo;
			if (stateDisplayInfo.Masters.Count != 0 && displayModeIds.Length > i)
			{
				displayInfo = new DisplayInfo(stateDisplayInfo.Masters[0], DisplayModeProvider.Instance.Modes.Where(m => m.DisplayModeId == displayModeIds[i]).First());
				page.MasterPageFile = GetMasterForDisplayInfo(displayInfo, context);
				page.Master.ID = "m";
				master = page.Master;
				if (stateDisplayInfo.Masters.Count > 1 && displayModeIds[i].Length == 0)
					master.MasterPageFile = stateDisplayInfo.Masters[1];
				else
					masterSwitch = true;
				i++;
			}
			while (master != null && !string.IsNullOrEmpty(master.MasterPageFile) && displayModeIds.Length > i)
			{
				displayInfo = new DisplayInfo(master.MasterPageFile, DisplayModeProvider.Instance.Modes.Where(m => m.DisplayModeId == displayModeIds[i]).First());
				master.MasterPageFile = GetMasterForDisplayInfo(displayInfo, context);
				master.Master.ID = "m";
				master = master.Master;
				if (!masterSwitch && stateDisplayInfo.Masters.Count > i && displayModeIds[i].Length == 0)
					master.MasterPageFile = stateDisplayInfo.Masters[i];
				else
					masterSwitch = true;
				i++;
			}
			if (stateDisplayInfo.Theme.Length != 0 && displayModeIds.Length > i)
			{
				displayInfo = new DisplayInfo(stateDisplayInfo.Theme, DisplayModeProvider.Instance.Modes.Where(m => m.DisplayModeId == displayModeIds[i]).First());
				page.Theme = GetThemeForDisplayInfo(displayInfo, context);
			}
		}

		/// <summary>
		/// Gets the browser specific master and <see cref="System.Web.WebPages.IDisplayMode"/> and is
		/// called when the page first loads
		/// </summary>
		/// <param name="master">The master for the browser specific page or master</param>
		/// <param name="displayMode">The browser specific page's <see cref="System.Web.WebPages.IDisplayMode"/>,
		/// used in conjunction with <see cref="System.Web.WebPages.DisplayModeProvider.RequireConsistentDisplayMode"/></param>
		/// <param name="context">The current <see cref="System.Web.HttpContextBase"/></param>
		/// <returns>The browser specific <see cref="System.Web.WebPages.DisplayInfo"/></returns>
		protected virtual DisplayInfo GetDisplayInfoForMaster(string master, IDisplayMode displayMode, HttpContextBase context)
		{
			return DisplayModeProvider.Instance.GetDisplayInfoForVirtualPath(master, context, v => HostingEnvironment.VirtualPathProvider.FileExists(v), displayMode);
		}

		/// <summary>
		/// Gets the browser specific master from the given <paramref name="displayInfo"/> and is called
		/// when the page posts back
		/// </summary>
		/// <param name="displayInfo">Contains the master for the browser specific page or master and the
		/// browser specific <see cref="System.Web.WebPages.IDisplayMode"/></param>
		/// <param name="context">The current <see cref="System.Web.HttpContextBase"/></param>
		/// <returns>The browser specific master</returns>
		protected virtual string GetMasterForDisplayInfo(DisplayInfo displayInfo, HttpContextBase context)
		{
			if (displayInfo.DisplayMode.DisplayModeId.Length != 0)
				return displayInfo.FilePath.Substring(0, displayInfo.FilePath.Length - 6) + displayInfo.DisplayMode.DisplayModeId + ".Master";
			return displayInfo.FilePath;
		}

		/// <summary>
		/// Gets the browser specific theme and <see cref="System.Web.WebPages.IDisplayMode"/> and is
		/// called when the page first loads
		/// </summary>
		/// <param name="theme">The theme for the browser specific page or master</param>
		/// <param name="displayMode">The browser specific page's <see cref="System.Web.WebPages.IDisplayMode"/>,
		/// used in conjunction with <see cref="System.Web.WebPages.DisplayModeProvider.RequireConsistentDisplayMode"/></param>
		/// <param name="context">The current <see cref="System.Web.HttpContextBase"/></param>
		/// <returns>The browser specific <see cref="System.Web.WebPages.DisplayInfo"/></returns>
		protected virtual DisplayInfo GetDisplayInfoForTheme(string theme, IDisplayMode displayMode, HttpContextBase context)
		{
			DisplayInfo displayInfo = DisplayModeProvider.Instance.GetDisplayInfoForVirtualPath(theme + ".Theme", context, v => HostingEnvironment.VirtualPathProvider.DirectoryExists("~/App_Themes/" + v.Substring(0, v.Length - 6)), displayMode);
			return new DisplayInfo(displayInfo.FilePath.Substring(0, displayInfo.FilePath.Length - 6), displayInfo.DisplayMode);
		}

		/// <summary>
		/// Gets the browser specific theme from the given <paramref name="displayInfo"/> and is called
		/// when the page posts back
		/// </summary>
		/// <param name="displayInfo">Contains the theme for the browser specific page and the browser
		/// specific <see cref="System.Web.WebPages.IDisplayMode"/></param>
		/// <param name="context">The current <see cref="System.Web.HttpContextBase"/></param>
		/// <returns>The browser specific theme</returns>
		protected virtual string GetThemeForDisplayInfo(DisplayInfo displayInfo, HttpContextBase context)
		{
			if (displayInfo.DisplayMode.DisplayModeId.Length != 0)
				return displayInfo.FilePath + "." + displayInfo.DisplayMode.DisplayModeId;
			return displayInfo.FilePath;
		}
	}
}
#else
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;

namespace Navigation
{
	internal class StateRouteHandler
	{
		private static readonly object _StateDisplayInfoKey = new object();

		internal StateRouteHandler(State state)
		{
			State = state;
		}

		private State State
		{
			get;
			set;
		}

		private static StateDisplayInfo GetStateDisplayInfo(State state, HttpRequest request)
		{
			bool mobile;
			string displayModes = HttpUtility.HtmlDecode(request.Form[StateContext.DISPLAY_MODES]);
			StateDisplayInfo stateDisplayInfo = new StateDisplayInfo();
			if (displayModes == null)
			{
				mobile = request.Browser.IsMobileDevice;
				stateDisplayInfo.DisplayModes = mobile ? "Mobile" : string.Empty;
				stateDisplayInfo.IsPostBack = false;
			}
			else
			{
				mobile = StringComparer.OrdinalIgnoreCase.Compare(Regex.Split(displayModes, "\\|")[0], "Mobile") == 0;
				stateDisplayInfo.DisplayModes = displayModes;
				stateDisplayInfo.IsPostBack = true;
			}
			stateDisplayInfo.Page = state.GetPage(mobile);
#if NET40Plus
			stateDisplayInfo.Route = state.GetRoute(mobile);
			stateDisplayInfo.RouteName = state.GetRouteName(mobile);
#endif
			stateDisplayInfo.Masters = state.GetMasters(mobile);
			stateDisplayInfo.Theme = state.GetTheme(mobile);
			return stateDisplayInfo;
		}

		internal static StateDisplayInfo SetPageStateDisplay(Page page, State state)
		{
			StateDisplayInfo stateDisplayInfo = GetStateDisplayInfo(state, page.Request);
			if (stateDisplayInfo.Masters.Count == 0 && !string.IsNullOrEmpty(page.MasterPageFile))
			{
				List<string> masters = new List<string>();
				masters.Add(page.MasterPageFile);
				stateDisplayInfo.Masters = new ReadOnlyCollection<string>(masters);
			}
			if (stateDisplayInfo.Theme.Length == 0 && !string.IsNullOrEmpty(page.Theme))
				stateDisplayInfo.Theme = page.Theme;
			if (!stateDisplayInfo.IsPostBack)
				UpdateStateDisplayInfo(stateDisplayInfo, page.Request, page);
			else
				UpdateStateDisplayInfo(stateDisplayInfo, page);
			return stateDisplayInfo;
		}

		private static void UpdateStateDisplayInfo(StateDisplayInfo stateDisplayInfo, HttpRequest request, Page page)
		{
			StringBuilder keyBuilder = new StringBuilder();
			keyBuilder.Append(stateDisplayInfo.DisplayModes);
			MasterPage master = null;
			if (stateDisplayInfo.Masters.Count != 0)
			{
				keyBuilder.Append("|");
				page.MasterPageFile = stateDisplayInfo.Masters[0];
				page.Master.ID = "m";
				master = page.Master;
				if (stateDisplayInfo.Masters.Count > 1)
					master.MasterPageFile = stateDisplayInfo.Masters[1];
			}
			int i = 2;
			while (master != null && !string.IsNullOrEmpty(master.MasterPageFile))
			{
				keyBuilder.Append("|");
				master.MasterPageFile = master.MasterPageFile;
				master.Master.ID = "m";
				master = master.Master;
				if (stateDisplayInfo.Masters.Count > i)
					master.MasterPageFile = stateDisplayInfo.Masters[i];
				i++;
			}
			if (stateDisplayInfo.Theme.Length != 0)
			{
				keyBuilder.Append("|");
				page.Theme = stateDisplayInfo.Theme;
			}
			stateDisplayInfo.DisplayModes = keyBuilder.ToString();
		}

		private static void UpdateStateDisplayInfo(StateDisplayInfo stateDisplayInfo, Page page)
		{
			string[] displayModeIds = Regex.Split(stateDisplayInfo.DisplayModes, "\\|");
			int i = 1;
			MasterPage master = null;
			if (stateDisplayInfo.Masters.Count != 0 && displayModeIds.Length > i)
			{
				page.MasterPageFile = stateDisplayInfo.Masters[0];
				page.Master.ID = "m";
				master = page.Master;
				if (stateDisplayInfo.Masters.Count > 1 && displayModeIds[i].Length == 0)
					master.MasterPageFile = stateDisplayInfo.Masters[1];
				i++;
			}
			while (master != null && !string.IsNullOrEmpty(master.MasterPageFile) && displayModeIds.Length > i)
			{
				master.MasterPageFile = master.MasterPageFile;
				master.Master.ID = "m";
				master = master.Master;
				if (stateDisplayInfo.Masters.Count > i && displayModeIds[i].Length == 0)
					master.MasterPageFile = stateDisplayInfo.Masters[i];
				i++;
			}
			if (stateDisplayInfo.Theme.Length != 0 && displayModeIds.Length > i)
			{
				page.Theme = stateDisplayInfo.Theme;
			}
		}
	}
}
#endif