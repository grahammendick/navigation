using Glimpse.Core.Extensibility;
using Navigation.Glimpse.AlternateType;
using System.Web.Routing;

namespace Navigation.Glimpse.Inspector
{
	public class StateRouteHandlerInspector : IInspector
	{
		public void Setup(IInspectorContext context)
		{
			AlternateType.StateRouteHandler alternateBaseImplementation = new AlternateType.StateRouteHandler(context.ProxyFactory);
			RouteCollection currentRoutes = RouteTable.Routes;
			Navigation.StateRouteHandler originalHandler = null;
			Route stateRoute;
			using (currentRoutes.GetWriteLock())
			{
				foreach (RouteBase route in currentRoutes)
				{
					stateRoute = route as Route;
					if (stateRoute != null)
					{
						originalHandler = stateRoute.RouteHandler as Navigation.StateRouteHandler;
						if (originalHandler != null)
						{
							Navigation.StateRouteHandler newHandler = null;
							alternateBaseImplementation.TryCreate(originalHandler, out newHandler, null, new object[] { originalHandler.State });
							stateRoute.RouteHandler = newHandler;
							context.Logger.Info(Resources.RouteSetupReplacedRouteHandler, stateRoute.Url);
						}
					}
				}
			}
		}
	}
}