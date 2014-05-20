using System.Web.Mvc;
using System.Web.Routing;

namespace Navigation.Mvc
{
	/// <summary>
	/// Registers all <see cref="State.Route"/> configuration information for MVC
	/// </summary>
	public class RouteConfig
	{
		/// <summary>
		/// Registers all <see cref="State.Route"/> configuration information
		/// </summary>
		public static void AddStateRoutes()
		{
			if (StateInfoConfig.Dialogs == null)
				return;
			ValueProviderFactories.Factories.Insert(3, new NavigationDataValueProviderFactory());
			GlobalFilters.Filters.Add(new RefreshAjaxAttribute());
			string controller, action, area;
			Route route;
			using (RouteTable.Routes.GetWriteLock())
			{
				foreach (Dialog dialog in StateInfoConfig.Dialogs)
				{
					foreach (State state in dialog.States)
					{
						controller = state.Attributes["controller"] != null ? state.Attributes["controller"].Trim() : string.Empty;
						action = state.Attributes["action"] != null ? state.Attributes["action"].Trim() : string.Empty;
						if (controller.Length != 0 && action.Length != 0)
						{
							area = state.Attributes["area"] != null ? state.Attributes["area"].Trim() : string.Empty;
							state.StateHandler = new MvcStateHandler();
							route = RouteTable.Routes.MapRoute("Mvc" + state.Id, state.Route);
							route.Defaults = StateInfoConfig.GetRouteDefaults(state, state.Route);
							route.Defaults["controller"] = controller;
							route.Defaults["action"] = action;
							route.DataTokens = new RouteValueDictionary() { { NavigationSettings.Config.StateIdKey, state.Id } };
							if (area.Length != 0)
								route.DataTokens["area"] = area;
							route.RouteHandler = new MvcStateRouteHandler(state);
						}
					}
				}
			}
		}
	}
}
