#if NET40Plus
using System.Web.Mvc;
using System.Web.Routing;

namespace Navigation
{
	internal static class RouteConfig
	{
		private static bool _Initialised = false;

		internal static void AddRoute(State state)
		{
			string controller = state.Attributes["controller"] != null ? state.Attributes["controller"].Trim() : string.Empty;
			string action = state.Attributes["action"] != null ? state.Attributes["action"].Trim() : string.Empty;
			if (controller.Length != 0 && action.Length != 0)
			{
				if (!_Initialised)
				{
					Initialise();
					_Initialised = true;
				}
				string area = state.Attributes["area"] != null ? state.Attributes["area"].Trim() : string.Empty;
				state.StateHandler = new MvcStateHandler();
				Route route = RouteTable.Routes.MapRoute("Mvc" + state.Id, state.Route);
				route.Defaults = StateInfoConfig.GetRouteDefaults(state, state.Route);
				route.Defaults["controller"] = controller;
				route.Defaults["action"] = action;
				route.DataTokens = new RouteValueDictionary() { { NavigationSettings.Config.StateIdKey, state.Id } };
				if (area.Length != 0)
					route.DataTokens["area"] = area;
				route.RouteHandler = new MvcStateRouteHandler(state);
			}
		}

		private static void Initialise()
		{
			ValueProviderFactories.Factories.Insert(3, new NavigationDataMvcValueProviderFactory());
			GlobalFilters.Filters.Add(new RefreshAjaxAttribute());
		}
	}
}
#endif
