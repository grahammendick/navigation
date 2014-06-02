#if NET45Plus
using System.Collections.Generic;
using System.Globalization;
using System.Web.ModelBinding;

namespace Navigation
{
	/// <summary>
	/// Represents a value provider for <see cref="Navigation.NavigationData"/> values
	/// </summary>
	public sealed class NavigationDataValueProvider : DictionaryValueProvider<object>
	{
		private ControlValueProvider ControlValueProvider
		{
			get;
			set;
		}

		/// <summary>
		/// Gets a value indicating whether the <see cref="Navigation.NavigationData"/> key
		/// will be retrieved from a <see cref="System.Web.UI.Control"/>
		/// </summary>
		public bool Control
		{
			get;
			private set;
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationDataValueProvider"/>
		/// class using the execution context
		/// </summary>
		/// <param name="modelBindingExecutionContext">The execution context</param>
		/// <param name="control">Indicates whether the <see cref="Navigation.NavigationData"/> 
		/// key will be retrieved from a <see cref="System.Web.UI.Control"/></param>
		/// <param name="propertyName">The <see cref="System.Web.UI.Control"/> property</param>
		public NavigationDataValueProvider(ModelBindingExecutionContext modelBindingExecutionContext, bool control, string propertyName)
			: base(GetNavigationDataDictionary(), CultureInfo.InvariantCulture)
		{
			ControlValueProvider = new ControlValueProvider(modelBindingExecutionContext, propertyName);
			Control = control;
		}

		private static Dictionary<string, object> GetNavigationDataDictionary()
		{
			Dictionary<string, object> data = new Dictionary<string, object>();
			foreach (NavigationDataItem item in StateContext.Data)
			{
				data[item.Key] = item.Value;
			}
			return data;
		}

		/// <summary>
		/// Returns the <see cref="Navigation.NavigationData"/> value using the specified key
		/// </summary>
		/// <param name="key">The <see cref="Navigation.NavigationData"/> key if <see cref="Control"/>
		/// is false, or the <see cref="System.Web.UI.Control"/> ID if <see cref="Control"/> is true</param>
		/// <returns>The <see cref="Navigation.NavigationData"/> value</returns>
		public override ValueProviderResult GetValue(string key)
		{
			if (Control)
			{
				ValueProviderResult result = ControlValueProvider.GetValue(key);
				if (result != null)
					key = result.AttemptedValue;
			}
			if (string.IsNullOrEmpty(key))
				return null;
			return base.GetValue(key);
		}
	}
}
#endif