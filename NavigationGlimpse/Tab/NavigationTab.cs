using Glimpse.Core.Extensibility;
using Glimpse.Core.Extensions;
using Navigation;
using NavigationGlimpse.Support;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.WebPages;

namespace NavigationGlimpse.Tab
{
	public class NavigationTab : TabBase, ITabSetup, IKey
	{
		public override object GetData(ITabContext context)
		{
			var request = context.GetRequestContext<HttpContextBase>();
			var mobile = request.Request["n0"] == null ? request.GetOverriddenBrowser().IsMobileDevice :
				request.Request["n0"].StartsWith("Mobile", StringComparison.Ordinal);
			var stateDisplayInfo = new StateDisplayInfo();
			if (StateContext.State != null)
			{
				stateDisplayInfo.Page = GetCurrentPage(context, mobile);
				stateDisplayInfo.Route = GetCurrentRoute(mobile);
				stateDisplayInfo.Theme = GetCurrentTheme(context, mobile);
				stateDisplayInfo.Masters = GetCurrentMasters(context, mobile);
			}
			return Canvas.Arrange(stateDisplayInfo);
		}

		private string GetCurrentPage(ITabContext context, bool mobile)
		{
			string page = null;
			var getDisplayInfoForPageMessage = context.GetMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetDisplayInfoForPage.Message>().FirstOrDefault();
			var getPageForDisplayInfoMessage = context.GetMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetPageForDisplayInfo.Message>().FirstOrDefault();
			if (getDisplayInfoForPageMessage != null)
				page = getDisplayInfoForPageMessage.Page;
			if (getPageForDisplayInfoMessage != null)
				page = getPageForDisplayInfoMessage.Page;
			if (page == null)
				page = (!mobile || StateContext.State.MobilePage.Length == 0) ? StateContext.State.Page : StateContext.State.MobilePage;
			return page;
		}

		private string GetCurrentRoute(bool mobile)
		{
			return (!mobile || (StateContext.State.MobilePage.Length == 0 && StateContext.State.MobileRoute.Length == 0)) ?
				StateContext.State.Route : StateContext.State.MobileRoute;
		}

		private string GetCurrentTheme(ITabContext context, bool mobile)
		{
			string theme = null;
			var getDisplayInfoForThemeMessage = context.GetMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetDisplayInfoForTheme.Message>().FirstOrDefault();
			var getThemeForDisplayInfoMessage = context.GetMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetThemeForDisplayInfo.Message>().FirstOrDefault();
			if (getDisplayInfoForThemeMessage != null)
				theme = getDisplayInfoForThemeMessage.Theme;
			if (getThemeForDisplayInfoMessage != null)
				theme = getThemeForDisplayInfoMessage.Theme;
			if (theme == null)
				theme = (!mobile || (StateContext.State.MobilePage.Length == 0 && StateContext.State.MobileTheme.Length == 0)) ?
					StateContext.State.Theme : StateContext.State.MobileTheme;
			return theme;
		}

		private List<string> GetCurrentMasters(ITabContext context, bool mobile)
		{
			var masters = new List<string>();
			var getDisplayInfoForMasterMessages = context.GetMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetDisplayInfoForMaster.Message>();
			var getMasterForDisplayInfoMessages = context.GetMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetMasterForDisplayInfo.Message>();
			foreach (var getDisplayInfoForMasterMessage in getDisplayInfoForMasterMessages)
				masters.Add(getDisplayInfoForMasterMessage.Master);
			foreach (var getMasterForDisplayInfoMessage in getMasterForDisplayInfoMessages)
				masters.Add(getMasterForDisplayInfoMessage.Master);
			if (masters.Count == 0)
				masters = ((!mobile || (StateContext.State.MobilePage.Length == 0 && StateContext.State.MobileMasters.Count == 0)) ?
					StateContext.State.Masters : StateContext.State.MobileMasters).ToList();
			return masters;
		}

		public override string Name
		{
			get
			{
				return "Navigation";
			}
		}

		public string Key
		{
			get
			{
				return "navigation_glimpse";
			}
		}

		public void Setup(ITabSetupContext context)
		{
			context.PersistMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetDisplayInfoForPage.Message>();
			context.PersistMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetPageForDisplayInfo.Message>();
			context.PersistMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetDisplayInfoForMaster.Message>();
			context.PersistMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetMasterForDisplayInfo.Message>();
			context.PersistMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetDisplayInfoForTheme.Message>();
			context.PersistMessages<NavigationGlimpse.AlternateType.StateRouteHandler.GetThemeForDisplayInfo.Message>();
		}
	}
}
