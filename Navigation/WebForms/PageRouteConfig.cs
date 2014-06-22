#if NET40Plus
using System;
using System.Globalization;
using System.Reflection;
using System.Web.Routing;

namespace Navigation
{
	internal static class PageRouteConfig
	{
#if NET45Plus
		private static Type _StateRouteHandlerType;

		static PageRouteConfig()
		{
			_StateRouteHandlerType = typeof(StateRouteHandler);
			if (NavigationSettings.Config.StateRouteHandler.Length != 0)
				_StateRouteHandlerType = Type.GetType(NavigationSettings.Config.StateRouteHandler);
		}
#endif

		internal static void AddRoutes(State state)
		{
			if (state.Page.Length != 0 && state.Attributes["route"] != null && state.Attributes["route"].Length != 0)
			{
				Route route = RouteTable.Routes.MapPageRoute(state.GetRouteName(false), state.GetRoute(false), state.GetPage(false), state.CheckPhysicalUrlAccess,
					StateInfoConfig.GetRouteDefaults(state, state.GetRoute(false)), null,
					new RouteValueDictionary() { 
					{ NavigationSettings.Config.StateIdKey, state.Id }, 
				});
#if NET45Plus
				if (state.MobilePage.Length == 0 && state.MobileRoute.Length == 0 && state.MobileMasters.Count == 0 && state.MobileTheme.Length == 0)
					route.RouteHandler = (StateRouteHandler)Activator.CreateInstance(_StateRouteHandlerType,
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
#endif
