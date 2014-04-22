using System.Web.Routing;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public class RouteConfig
	{
		public static void AddStateRoutes()
		{
			if (StateInfoConfig.Dialogs == null)
				return;
			string controller, action;
			RouteValueDictionary defaults;
			Route route;
			using (RouteTable.Routes.GetWriteLock())
			{
				foreach (Dialog dialog in StateInfoConfig.Dialogs)
				{
					foreach (State state in dialog.States)
					{
						controller = state.Attributes["controller"] != null ? state.Attributes["controller"].Trim() : string.Empty;
						action = state.Attributes["action"] != null ? state.Attributes["action"].Trim() : string.Empty;
						if (controller.Length != 0 && action.Length != 0 && state.Route.Length != 0)
						{
							state.StateHandler = new StateHandler();
							defaults = StateInfoConfig.GetRouteDefaults(state, state.Route);
							defaults["controller"] = controller;
							defaults["action"] = action;
							route = RouteTable.Routes.MapRoute("Mvc" + state.Id, state.Route);
							route.Defaults = defaults;
							route.RouteHandler = new MvcStateRouteHandler(state);
						}
					}
				}
			}
		}
	}
}
