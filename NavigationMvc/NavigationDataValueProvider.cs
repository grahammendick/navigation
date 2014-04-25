using System.Collections.Generic;
using System.Globalization;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public sealed class NavigationDataValueProvider : DictionaryValueProvider<object>
	{
		public NavigationDataValueProvider() : base(GetNavigationDataDictionary(), CultureInfo.InvariantCulture)
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
