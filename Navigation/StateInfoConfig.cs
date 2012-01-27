using System;
using System.Configuration;
using System.Globalization;
using System.Web.Routing;

namespace Navigation
{
	/// <summary>
	/// Provides static access to the <see cref="Navigation.Dialog"/>, <see cref="Navigation.State"/>
	/// and <see cref="Navigation.Transition"/> configuration in the Navigation/StateInfo section
	/// </summary>
	public static class StateInfoConfig
	{
		private const string PARAMETER = "{{{0}}}";
		private const string OPTIONAL_PARAMETER = "{{*{0}}}";

		/// <summary>
		/// Gets a collection of <see cref="Navigation.Dialog"/> information with their child
		/// <see cref="Navigation.State"/> information and grandchild <see cref="Navigation.Transition"/>
		/// information
		/// </summary>
		public static StateInfoCollection<Dialog> Dialogs
		{
			get
			{
				return (StateInfoCollection<Dialog>)ConfigurationManager.GetSection("Navigation/StateInfo");
			}
		}

		/// <summary>
		/// Registers all <see cref="Navigation.State.Route"/> configuration information
		/// </summary>
		/// <param name="routes">Route collection</param>
		public static void AddStateRoutes(RouteCollection routes)
		{
			foreach (Dialog dialog in Dialogs)
			{
				foreach (State state in dialog.States)
				{
					if (state.Route.Length != 0)
						routes.MapPageRoute(state.GetRouteName(false), state.GetRoute(false), state.GetPage(false), state.CheckPhysicalUrlAccess,
							GetDefaults(state, state.GetRoute(false)), null,
							new RouteValueDictionary() { 
								{ StateContext.STATE, state.DialogStateKey }, 
							});
					if (state.MobileRoute.Length != 0)
						routes.MapPageRoute(state.GetRouteName(true), state.GetRoute(true), state.GetPage(true), state.CheckPhysicalUrlAccess,
							GetDefaults(state, state.GetRoute(true)), null,
							new RouteValueDictionary() { 
								{ StateContext.STATE, state.DialogStateKey }, 
							});
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
	}
}
