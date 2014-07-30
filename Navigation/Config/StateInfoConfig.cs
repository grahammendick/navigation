using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
#if NET40Plus
using System.Linq;
using System.Web.Routing;
#endif

namespace Navigation
{
	/// <summary>
	/// Provides static access to the <see cref="Navigation.Dialog"/>, <see cref="Navigation.State"/>
	/// and <see cref="Navigation.Transition"/> configuration in the Navigation/StateInfo section
	/// </summary>
	public static class StateInfoConfig
	{
		private static StateInfoCollection<Dialog> _Dialogs;
		private static FluentStateInfo _Fluent = new FluentStateInfo();
		private static Dictionary<string, Type> _KeyToTypeList = CreateKeyToTypeList();
		private const string PARAMETER = "{{{0}}}";
		private const string OPTIONAL_PARAMETER = "{{*{0}}}";


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
		/// <param name="expression">The key/value pairs with types optional. Values are optional if
		/// <paramref name="useCurrentData"/> is true</param>
		/// <param name="state">Holds the <see cref="Navigation.State.DefaultTypes"/> of the keys</param>
		/// <param name="useCurrentData">Indicates whether values can be retrieved from the current
		/// <see cref="Navigation.StateContext.Data"/></param>
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
		public static NavigationData ParseNavigationDataExpression(string expression, State state, bool useCurrentData)
		{
			if (expression == null)
				throw new ArgumentNullException("expression");
			string[] keyTypeValue;
			expression = expression.Trim();
			bool includeCurrentData = useCurrentData && expression.StartsWith("&", StringComparison.Ordinal);
			NavigationData navigationData = new NavigationData(includeCurrentData);
			if (includeCurrentData)
			{
				expression = expression.Substring(1);
				if (expression.Length == 0)
					return navigationData;
			}
			foreach (string dataItem in expression.Split(new char[] { ',' }))
			{
				keyTypeValue = dataItem.Split(new char[] { '=' });
				if (keyTypeValue.Length == 2)
					SetNavigationKeyValue(navigationData, keyTypeValue, state);
				else
					SetNavigationKey(navigationData, keyTypeValue, useCurrentData, includeCurrentData);
			}
			return navigationData;
		}

		private static void SetNavigationKeyValue(NavigationData navigationData, string[] keyTypeValue, State state)
		{
			string[] keyType = keyTypeValue[0].Trim().Split(new char[] { '?' });
			if (keyType.Length > 2)
				throw new FormatException(Resources.InvalidNavigationDataExpression);
			string value = keyTypeValue[1].Trim();
			string key = keyType[0].Trim();
			if (string.IsNullOrEmpty(key))
				throw new FormatException(Resources.InvalidNavigationDataExpression);
			Type type = typeof(string);
			if (state != null && state.DefaultTypes[key] != null)
				type = state.DefaultTypes[key];
			if (keyType.Length == 2)
				type = StateInfoConfig.GetType(keyType[1].Trim().ToUpperInvariant());
			if (type == null)
				throw new FormatException(Resources.InvalidNavigationDataExpression);
			object obj = Convert.ChangeType(value, type, CultureInfo.CurrentCulture);
			navigationData[key] = obj;
		}

		private static void SetNavigationKey(NavigationData navigationData, string[] keyTypeValue, bool useCurrentData, bool includeCurrentData)
		{
			if (keyTypeValue.Length == 1 && useCurrentData)
			{
				string key = keyTypeValue[0].Trim();
				bool retain = key.StartsWith("+", StringComparison.Ordinal);
				bool remove = key.StartsWith("-", StringComparison.Ordinal);
				if (retain || remove)
					key = key.Substring(1).Trim();
				else
					remove = includeCurrentData;
				if (remove)
					navigationData[key] = null;
				else
					navigationData[key] = StateContext.Data[key];
			}
			else
				throw new FormatException(Resources.InvalidNavigationDataExpression);
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
				return _Dialogs ?? (StateInfoCollection<Dialog>)ConfigurationManager.GetSection("Navigation/StateInfo");
			}
			internal set
			{
				_Dialogs = value;
			}
		}

		public static FluentStateInfo Fluent
		{
			get
			{
				return _Fluent;
			}
		}

#if NET40Plus
		/// <summary>
		/// Registers all <see cref="Navigation.State.Route"/> configuration information.
		/// This method is called automatically by ASP.NET and should not be called manually
		/// </summary>
		public static void AddStateRoutes()
		{
			if (StateInfoConfig.Dialogs == null)
				return;
			using (RouteTable.Routes.GetWriteLock())
			{
				RouteTable.Routes.Ignore("{resource}.axd/{*pathInfo}");
				var states = from d in Dialogs
							 from s in d.States
							 orderby s.Route.StartsWith("{", StringComparison.Ordinal)
							 select s;
				foreach (State state in states)
				{
					PageRouteConfig.AddRoutes(state);
					RouteConfig.AddRoute(state);
					WebApiRouteConfig.AddHttpRoute(state);
				}
			}
		}

		/// <summary>
		/// Returns <paramref name="state"/> defaults for the specified <paramref name="route"/> parameters
		/// </summary>
		/// <param name="state">The <see cref="State"/> to check for default values</param>
		/// <param name="route">The route parameters</param>
		/// <returns><see cref="State"/> defaults for the supplied route</returns>
		public static RouteValueDictionary GetRouteDefaults(State state, string route)
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
