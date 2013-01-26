using Navigation;
using Navigation.Properties;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Web;
using System.Web.Routing;

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
		/// Creates <see cref="Navigation.NavigationData"/> that corresponds to the key/value pairs
		/// specified by the <paramref name="expression"/></summary>
		/// <param name="expression">The key/value pairs with types optional</param>
		/// <param name="state">Holds the <see cref="Navigation.State.DefaultTypes"/> of the keys</param>
		/// <returns>The <see cref="Navigation.NavigationData"/> that corresponds to the specified
		/// key/value pairs</returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="expression"/> is null</exception>
		/// <exception cref="System.FormatException">Either the <paramref name="expression"/> was not
		/// in a recognised format or it contained an unrecognised type or a value was not in a format
		/// recognised by its corresponding type</exception>
		/// <exception cref="System.InvalidCastException">The <paramref name="expression"/> specifies types
		/// of guid or timespan</exception>
		/// <exception cref="System.OverflowException">A value represents a number that is out of the
		/// range of its corresponding type</exception>
		public static NavigationData ParseNavigationDataExpression(string expression, State state)
		{
			if (expression == null)
				throw new ArgumentNullException("expression");
			string[] keyTypeValue, keyType;
			string key, value;
			Type type;
			object obj;
			NavigationData navigationData = new NavigationData();
			foreach (string dataItem in expression.Split(new char[] { ',' }))
			{
				keyTypeValue = dataItem.Split(new char[] { '=' });
				if (keyTypeValue.Length != 2)
					throw new FormatException(Resources.InvalidNavigationDataExpression);
				keyType = keyTypeValue[0].Trim().Split(new char[] { '?' });
				if (keyType.Length > 2)
					throw new FormatException(Resources.InvalidNavigationDataExpression);
				value = keyTypeValue[1].Trim();
				key = keyType[0].Trim();
				if (string.IsNullOrEmpty(key))
					throw new FormatException(Resources.InvalidNavigationDataExpression);
				type = typeof(string);
				if (state != null && state.DefaultTypes[key] != null)
					type = state.DefaultTypes[key];
				if (keyType.Length == 2)
					type = StateInfoConfig.GetType(keyType[1].Trim().ToUpperInvariant());
				if (type == null)
					throw new FormatException(Resources.InvalidNavigationDataExpression);
				obj = Convert.ChangeType(value, type, CultureInfo.CurrentCulture);
				navigationData[key] = obj;
			}
			return navigationData;
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
						if (state.MobilePage.Length == 0 && state.MobileRoute.Length == 0 && state.MobileMasters.Count == 0 && state.MobileTheme.Length == 0)
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
