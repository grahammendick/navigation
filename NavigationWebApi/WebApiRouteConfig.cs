using System.Web.Http;
using System.Web.Http.ValueProviders;
using System.Web.Routing;

namespace Navigation.WebApi
{
	/// <summary>
	/// Registers all <see cref="State.Route"/> configuration information for Web Api
	/// </summary>
	public class WebApiRouteConfig
	{
		/// <summary>
		/// Registers all <see cref="State.Route"/> configuration information
		/// </summary>
		public static void AddHttpRoutes()
		{
			if (StateInfoConfig.Dialogs == null)
				return;
			GlobalConfiguration.Configuration.Services.Insert(typeof(ValueProviderFactory), 0, new NavigationDataValueProviderFactory());
			string apiController, action;
			Route route;
			RouteValueDictionary defaults;
			using (RouteTable.Routes.GetWriteLock())
			{
				foreach (Dialog dialog in StateInfoConfig.Dialogs)
				{
					foreach (State state in dialog.States)
					{
						apiController = state.Attributes["apiController"] != null ? state.Attributes["apiController"].Trim() : string.Empty;
						action = state.Attributes["action"] != null ? state.Attributes["action"].Trim() : string.Empty;
						if (apiController.Length != 0 && action.Length != 0)
						{
							state.StateHandler = new WebApiStateHandler();
							defaults = StateInfoConfig.GetRouteDefaults(state, state.Route);
							defaults["controller"] = apiController;
							defaults["action"] = action;
							GlobalConfiguration.Configuration.Routes.MapHttpRoute("WebApi" + state.Id, state.Route, defaults);
							route = (Route) RouteTable.Routes["WebApi" + state.Id];
							route.DataTokens = new RouteValueDictionary() { { NavigationSettings.Config.StateIdKey, state.Id } };
							route.RouteHandler = new WebApiStateRouteHandler(state);
						}
					}
				}
			}
		}
	}
}
