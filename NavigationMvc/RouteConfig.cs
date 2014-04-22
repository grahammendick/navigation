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
							route = RouteTable.Routes.MapRoute("Mvc" + state.Id, state.Route);
							route.Defaults = StateInfoConfig.GetRouteDefaults(state, state.Route);
							route.Defaults["controller"] = controller;
							route.Defaults["action"] = action;
							route.RouteHandler = new MvcStateRouteHandler(state);
						}
					}
				}
			}
		}
	}
}
