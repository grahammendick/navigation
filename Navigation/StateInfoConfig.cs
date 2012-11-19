using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Web;
using System.Web.Routing;
using Navigation;

[assembly: PreApplicationStartMethod(typeof(StateInfoConfig), "AddStateRoutes")]
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
		private static Dictionary<string, Type> _KeyToTypeList = CreateKeyToTypeList();

		private static Dictionary<string, Type> CreateKeyToTypeList()
		{
			Dictionary<string, Type> list = new Dictionary<string, Type>();
			list.Add("STRING", typeof(string));
			list.Add("BOOL", typeof(bool));
			list.Add("SHORT", typeof(short));
			list.Add("INT", typeof(int));
			list.Add("LONG", typeof(long));
			list.Add("FLOAT", typeof(float));
			list.Add("DOUBLE", typeof(double));
			list.Add("DECIMAL", typeof(decimal));
			list.Add("DATETIME", typeof(DateTime));
			list.Add("TIMESPAN", typeof(TimeSpan));
			list.Add("BYTE", typeof(byte));
			list.Add("CHAR", typeof(char));
			list.Add("GUID", typeof(Guid));
			return list;
		}

		internal static Type GetType(string key)
		{
			if (!_KeyToTypeList.ContainsKey(key))
				return null;
			return _KeyToTypeList[key];
		}

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
		/// Registers all <see cref="Navigation.State.Route"/> configuration information.
		/// This method is called automatically by ASP.NET and should not be called manually
		/// </summary>
		public static void AddStateRoutes()
		{
			Route route;
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
						if (!state.MobileOverride)
							route.RouteHandler = new StateRouteHandler(state);
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
