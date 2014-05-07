using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Http.ValueProviders;

namespace Navigation.WebApi
{
	public class NavigationDataValueProvider : IValueProvider
	{
		private Dictionary<string, ValueProviderResult> _values = new Dictionary<string, ValueProviderResult>(StringComparer.OrdinalIgnoreCase);

		public NavigationDataValueProvider()
		{
			foreach (NavigationDataItem item in StateContext.Data)
			{
				_values[item.Key] = new ValueProviderResult(item.Value, Convert.ToString(item.Value, CultureInfo.InvariantCulture), CultureInfo.InvariantCulture);
			}
		}

		public bool ContainsPrefix(string prefix)
		{
			return _values.Keys.Contains(prefix);
		}

		public ValueProviderResult GetValue(string key)
		{
			if (key == null)
				throw new ArgumentNullException("key");
			ValueProviderResult result;
			_values.TryGetValue(key, out result);
			return result;
		}
	}
}
