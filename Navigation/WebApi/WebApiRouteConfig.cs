#if NET40Plus
using System.Web.Http;
using System.Web.Http.ValueProviders;
using System.Web.Routing;

namespace Navigation
{
	internal static class WebApiRouteConfig
	{

		private static bool _Initialised = false;

		internal static void AddHttpRoute(State state)
		{
			string apiController = state.Attributes["apiController"] != null ? state.Attributes["apiController"].Trim() : string.Empty;
			string action = state.Attributes["action"] != null ? state.Attributes["action"].Trim() : string.Empty;
			if (apiController.Length != 0 && action.Length != 0)
			{
				if (!_Initialised)
				{
					Initialise();
					_Initialised = true;
				}
				state.StateHandler = new WebApiStateHandler();
				RouteValueDictionary defaults = StateInfoConfig.GetRouteDefaults(state, state.Route);
				defaults["controller"] = apiController;
				defaults["action"] = action;
				GlobalConfiguration.Configuration.Routes.MapHttpRoute("WebApi" + state.Id, state.Route, defaults);
				Route route = (Route)RouteTable.Routes["WebApi" + state.Id];
				route.DataTokens = new RouteValueDictionary() { { NavigationSettings.Config.StateIdKey, state.Id } };
				route.RouteHandler = new WebApiStateRouteHandler(state);
			}
		}

		private static void Initialise()
		{
			GlobalConfiguration.Configuration.Services
				.Insert(typeof(ValueProviderFactory), 0, new NavigationDataValueWebApiProviderFactory());
		}
	}
}
#endif
