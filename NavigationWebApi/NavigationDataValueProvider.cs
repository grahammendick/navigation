using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Http.ValueProviders;

namespace Navigation.WebApi
{
	/// <summary>
	/// Represents a value provider for <see cref="NavigationData"/> values
	/// </summary>
	public class NavigationDataValueProvider : IValueProvider
	{
		private Dictionary<string, ValueProviderResult> _values = new Dictionary<string, ValueProviderResult>(StringComparer.OrdinalIgnoreCase);

		/// <summary>
		/// Initializes a new instance of the <see cref="NavigationDataValueProvider"/> class
		/// </summary>
		public NavigationDataValueProvider()
		{
			foreach (NavigationDataItem item in StateContext.Data)
			{
				_values[item.Key] = new ValueProviderResult(item.Value, Convert.ToString(item.Value, CultureInfo.InvariantCulture), CultureInfo.InvariantCulture);
			}
		}

		/// <summary>
		/// Determines whether the <see cref="NavigationData"/> contains the specified prefix
		/// </summary>
		/// <param name="prefix">The prefix to search for</param>
		/// <returns>True if the collection contains the specified prefix; otherwise, false</returns>
		public bool ContainsPrefix(string prefix)
		{
			return _values.Keys.Contains(prefix);
		}

		/// <summary>
		/// Retrieves a <see cref="NavigationData"/> value for the specified key
		/// </summary>
		/// <param name="key">The key for the <see cref="NavigationData"/> item</param>
		/// <returns>The value of <see cref="NavigationData"/> item</returns>
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
