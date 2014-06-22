#if NET40Plus
using System;
using System.Globalization;
using System.Reflection;
using System.Web.Routing;

namespace Navigation
{
	internal static class PageRouteConfig
	{
		internal static void AddStateRoutes()
		{
			if (StateInfoConfig.Dialogs == null)
				return;
			Route route;
			using (RouteTable.Routes.GetWriteLock())
			{
				RouteTable.Routes.Ignore("{resource}.axd/{*pathInfo}");
#if NET45Plus
				Type stateRouteHandlerType = typeof(StateRouteHandler);
				if (NavigationSettings.Config.StateRouteHandler.Length != 0)
					stateRouteHandlerType = Type.GetType(NavigationSettings.Config.StateRouteHandler);
#endif
				foreach (Dialog dialog in StateInfoConfig.Dialogs)
				{
					foreach (State state in dialog.States)
					{
						if (state.Page.Length != 0 && state.Attributes["route"] != null && state.Attributes["route"].Length != 0)
						{
							route = RouteTable.Routes.MapPageRoute(state.GetRouteName(false), state.GetRoute(false), state.GetPage(false), state.CheckPhysicalUrlAccess,
								StateInfoConfig.GetRouteDefaults(state, state.GetRoute(false)), null,
								new RouteValueDictionary() { 
								{ NavigationSettings.Config.StateIdKey, state.Id }, 
							});
#if NET45Plus
							if (state.MobilePage.Length == 0 && state.MobileRoute.Length == 0 && state.MobileMasters.Count == 0 && state.MobileTheme.Length == 0)
								route.RouteHandler = (StateRouteHandler)Activator.CreateInstance(stateRouteHandlerType,
									BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance, null, new object[] { state }, null);
#endif
						}
						if (state.Page.Length != 0 && state.Attributes["mobileRoute"] != null && state.Attributes["mobileRoute"].Length != 0)
							RouteTable.Routes.MapPageRoute(state.GetRouteName(true), state.GetRoute(true), state.GetPage(true), state.CheckPhysicalUrlAccess,
								StateInfoConfig.GetRouteDefaults(state, state.GetRoute(true)), null,
								new RouteValueDictionary() { 
								{ NavigationSettings.Config.StateIdKey, state.Id }, 
							});
					}
				}
			}
		}
	}
}
#endif
