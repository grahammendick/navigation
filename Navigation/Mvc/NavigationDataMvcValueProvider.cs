using System.Collections.Generic;
using System.Globalization;
using System.Web.Mvc;

namespace Navigation
{
	/// <summary>
	/// Represents a value provider for <see cref="NavigationData"/> values
	/// </summary>
	public sealed class NavigationDataMvcValueProvider : DictionaryValueProvider<object>
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="NavigationDataMvcValueProvider"/> class
		/// </summary>
		public NavigationDataMvcValueProvider() : base(GetNavigationDataDictionary(), CultureInfo.InvariantCulture)
		{
		}

		private static Dictionary<string, object> GetNavigationDataDictionary()
		{
			Dictionary<string, object> data = new Dictionary<string, object>();
			foreach(NavigationDataItem item in StateContext.Data)
			{
				data[item.Key] = item.Value;
			}
			return data;
		}
	}
}
