using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;

namespace Navigation
{
	public static class FluentExtensions
	{
		public static K DefaultTypes<K>(this K state, object defaultTypes) where K : FluentState
		{
			state.DefaultTypes.Clear();
			foreach (PropertyDescriptor defaultTypeProperty in TypeDescriptor.GetProperties(defaultTypes))
			{
				var type = defaultTypeProperty.GetValue(defaultTypes) as Type;
				if (type == null)
					throw new ArgumentException("defaultTypes");
				state.DefaultTypes.Add(new KeyValuePair<string, Type>(defaultTypeProperty.Name, type));
			}
			return state;
		}

		public static K Defaults<K>(this K state, object defaults) where K : FluentState
		{
			state.Defaults.Clear();
			foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(defaults))
			{
				if (defaultProperty.GetValue(defaults) != null)
					state.Defaults.Add(new KeyValuePair<string, object>(defaultProperty.Name, defaultProperty.GetValue(defaults)));
			}
			return state;
		}

		public static K Derived<K>(this K state, params string[] derived) where K : FluentState
		{
			state.Derived.Clear();
			foreach (var key in derived)
			{
				if (string.IsNullOrEmpty(key))
					throw new ArgumentException("key");
				state.Derived.Add(key.Trim());
			}
			return state;
		}

		public static K Attributes<K>(this K state, object attributes) where K : FluentState
		{
			foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(attributes))
			{
				if (defaultProperty.GetValue(attributes) != null)
					state.AddAttribute(defaultProperty.Name, Convert.ToString(defaultProperty.GetValue(attributes), CultureInfo.InvariantCulture));
			}
			return state;
		}

		public static K CheckPhysicalUrlAccess<K>(this K state, bool check) where K : WebFormsState
		{
			state.AddAttribute("checkPhysicalUrlAccess", check ? "true" : "false");
			return state;
		}

#if !NET40Plus
		public static K Masters<K>(this K state, params string[] masters) where K : WebFormsState
		{
			state.AddAttribute("masters", string.Join(",", masters));
			return state;
		}
#endif
	}
}
