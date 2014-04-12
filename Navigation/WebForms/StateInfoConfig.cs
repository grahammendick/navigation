using Navigation;
using System;
using System.Globalization;
using System.Reflection;
using System.Web;
using System.Web.Routing;

[assembly: PreApplicationStartMethod(typeof(StateInfoConfig), "AddStateRoutes")]
namespace Navigation
{
	public partial class StateInfoConfig
	{

#if NET40Plus
		/// <summary>
		/// Registers all <see cref="Navigation.State.Route"/> configuration information.
		/// This method is called automatically by ASP.NET and should not be called manually
		/// </summary>
		public static void AddStateRoutes()
		{
			if (Dialogs == null)
				return;
			Route route;
			using (RouteTable.Routes.GetWriteLock())
			{
#if NET45Plus
				Type stateRouteHandlerType = typeof(StateRouteHandler);
				if (NavigationSettings.Config.StateRouteHandler.Length != 0)
					stateRouteHandlerType = Type.GetType(NavigationSettings.Config.StateRouteHandler);
#endif
				foreach (Dialog dialog in Dialogs)
				{
					foreach (State state in dialog.States)
					{
						if (state.Route.Length != 0)
						{
							route = RouteTable.Routes.MapPageRoute(state.GetRouteName(false), state.GetRoute(false), state.GetPage(false), state.CheckPhysicalUrlAccess,
								GetDefaults(state, state.GetRoute(false)), null,
								new RouteValueDictionary() { 
								{ StateContext.STATE, state.DialogStateKey }, 
							});
#if NET45Plus
							if (state.MobilePage.Length == 0 && state.MobileRoute.Length == 0 && state.MobileMasters.Count == 0 && state.MobileTheme.Length == 0)
								route.RouteHandler = (StateRouteHandler)Activator.CreateInstance(stateRouteHandlerType,
									BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance, null, new object[] { state }, null);
#endif
						}
						if (state.MobileRoute.Length != 0)
							RouteTable.Routes.MapPageRoute(state.GetRouteName(true), state.GetRoute(true), state.GetPage(true), state.CheckPhysicalUrlAccess,
								GetDefaults(state, state.GetRoute(true)), null,
								new RouteValueDictionary() { 
								{ StateContext.STATE, state.DialogStateKey }, 
							});
					}
				}
			}
		}

		private static RouteValueDictionary GetDefaults(State state, string route)
		{
			RouteValueDictionary defaults = new RouteValueDictionary();
			foreach (string key in state.FormattedDefaults.Keys)
			{
				if (route.IndexOf(string.Format(CultureInfo.InvariantCulture, PARAMETER, key), StringComparison.Ordinal) >= 0
					|| route.IndexOf(string.Format(CultureInfo.InvariantCulture, OPTIONAL_PARAMETER, key), StringComparison.Ordinal) >= 0)
					defaults.Add(key, state.FormattedDefaults[key]);
			}
			return defaults;
		}
#endif
	}
}
