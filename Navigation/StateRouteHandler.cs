using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Compilation;
using System.Web.Hosting;
using System.Web.Routing;
using System.Web.UI;
using System.Web.WebPages;

namespace Navigation
{
	internal class StateRouteHandler : IRouteHandler
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

		public IHttpHandler GetHttpHandler(RequestContext requestContext)
		{
			if (requestContext == null)
				throw new ArgumentNullException("requestContext");
			StateDisplayInfo stateDisplayInfo;
			string displayModes = requestContext.HttpContext.Request.Form[StateContext.DISPLAY_MODES];
			if (displayModes == null)
				stateDisplayInfo = GetStateDisplayInfo(requestContext.HttpContext);
			else
				stateDisplayInfo = GetStateDisplayInfo(displayModes);
			requestContext.HttpContext.Items[_StateDisplayInfoKey] = stateDisplayInfo;
			return (Page)BuildManager.CreateInstanceFromVirtualPath(stateDisplayInfo.Page, typeof(Page));
		}

		private StateDisplayInfo GetStateDisplayInfo(HttpContextBase context)
		{
			StateDisplayInfo stateDisplayInfo = new StateDisplayInfo();
			stateDisplayInfo.IsPostBack = false;
			DisplayInfo displayInfo = DisplayModeProvider.Instance.GetDisplayInfoForVirtualPath(State.Page, context, v => HostingEnvironment.VirtualPathProvider.FileExists(v), null);
			stateDisplayInfo.DisplayMode = displayInfo.DisplayMode;
			stateDisplayInfo.Page = displayInfo.FilePath;
			stateDisplayInfo.DisplayModes = displayInfo.DisplayMode.DisplayModeId;
			stateDisplayInfo.Route = State.Route;
			stateDisplayInfo.RouteName = State.GetRouteName(false);
			stateDisplayInfo.Masters = State.Masters;
			stateDisplayInfo.Theme = State.Theme;
			if (StringComparer.InvariantCultureIgnoreCase.Compare(State.Page, stateDisplayInfo.Page) != 0)
			{
				stateDisplayInfo.Masters = new ReadOnlyCollection<string>(new string[0]);
				stateDisplayInfo.Theme = string.Empty;
			}
			return stateDisplayInfo;
		}

		private StateDisplayInfo GetStateDisplayInfo(string displayModes)
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
			if (displayModeIds[0].Length > 0)
			{
				string page = State.Page.Substring(0, State.Page.Length - 4) + displayModeIds[0] + ".aspx";
				if (HostingEnvironment.VirtualPathProvider.FileExists(page))
				{
					stateDisplayInfo.Masters = new ReadOnlyCollection<string>(new string[0]);
					stateDisplayInfo.Theme = string.Empty;
					stateDisplayInfo.Page = page;
				}
			}
			return stateDisplayInfo;
		}

		private static StateDisplayInfo GetStateDisplayInfo(State state, HttpContextBase context)
		{
			bool mobile;
			string displayModes = context.Request.Form[StateContext.DISPLAY_MODES];
			StateDisplayInfo stateDisplayInfo = new StateDisplayInfo();
			if (displayModes == null)
			{
				mobile = new HttpContextWrapper(HttpContext.Current).GetOverriddenBrowser().IsMobileDevice;
				stateDisplayInfo.DisplayModes = mobile ? "Mobile" : string.Empty;
				stateDisplayInfo.IsPostBack = false;
			}
			else
			{
				mobile = StringComparer.InvariantCultureIgnoreCase.Compare(Regex.Split(displayModes, "\\|")[0], "Mobile") == 0;
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

		internal static StateDisplayInfo SetPageStateDisplay(Page page, State state)
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
				UpdateStateDisplayInfo(stateDisplayInfo, page);
			return stateDisplayInfo;
		}

		private static void UpdateStateDisplayInfo(StateDisplayInfo stateDisplayInfo, HttpContextBase context, Page page)
		{
			DisplayInfo displayInfo;
			StringBuilder keyBuilder = new StringBuilder();
			keyBuilder.Append(stateDisplayInfo.DisplayModes);
			MasterPage master = null;
			bool masterSwitch = false;
			if (stateDisplayInfo.Masters.Count != 0)
			{
				displayInfo = DisplayModeProvider.Instance.GetDisplayInfoForVirtualPath(stateDisplayInfo.Masters[0], context, v => HostingEnvironment.VirtualPathProvider.FileExists(v), stateDisplayInfo.DisplayMode);
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
				displayInfo = DisplayModeProvider.Instance.GetDisplayInfoForVirtualPath(master.MasterPageFile, context, v => HostingEnvironment.VirtualPathProvider.FileExists(v), stateDisplayInfo.DisplayMode);
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
				displayInfo = DisplayModeProvider.Instance.GetDisplayInfoForVirtualPath(stateDisplayInfo.Theme + ".Theme", context, v => HostingEnvironment.VirtualPathProvider.DirectoryExists("~/App_Themes/" + v.Substring(0, v.Length - 6)), stateDisplayInfo.DisplayMode);
				keyBuilder.Append("|");
				keyBuilder.Append(displayInfo.DisplayMode.DisplayModeId);
				page.Theme = displayInfo.FilePath.Substring(0, displayInfo.FilePath.Length - 6);
			}
			stateDisplayInfo.DisplayModes = keyBuilder.ToString();
		}

		private static void UpdateStateDisplayInfo(StateDisplayInfo stateDisplayInfo, Page page)
		{
			string[] displayModeIds = Regex.Split(stateDisplayInfo.DisplayModes, "\\|");
			int i = 1;
			MasterPage master = null;
			bool masterSwitch = false;
			if (stateDisplayInfo.Masters.Count != 0 && displayModeIds.Length > i)
			{
				page.MasterPageFile = stateDisplayInfo.Masters[0];
				if (displayModeIds[i].Length != 0)
					page.MasterPageFile = stateDisplayInfo.Masters[0].Substring(0, stateDisplayInfo.Masters[0].Length - 6) + displayModeIds[i] + ".Master";
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
				master.MasterPageFile = master.MasterPageFile;
				if (displayModeIds[i].Length != 0)
					master.MasterPageFile = master.MasterPageFile.Substring(0, master.MasterPageFile.Length - 6) + displayModeIds[i] + ".Master";
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
				page.Theme = stateDisplayInfo.Theme;
				if (displayModeIds[i].Length > 0)
					page.Theme = stateDisplayInfo.Theme + "." + displayModeIds[i];
			}
		}
	}
}
