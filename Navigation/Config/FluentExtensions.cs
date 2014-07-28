using System;
using System.ComponentModel;

namespace Navigation
{
	public static class FluentExtensions
	{
		public static K DefaultTypes<K>(this K state, object defaultTypes) where K : FluentState
		{
			foreach (PropertyDescriptor defaultTypeProperty in TypeDescriptor.GetProperties(defaultTypes))
			{
				var type = defaultTypeProperty.GetValue(defaultTypes) as Type;
				if (type == null)
					throw new ArgumentException("defaultTypes");
				state.AddDefaultType(defaultTypeProperty.Name, type);
			}
			return state;
		}

		public static K Defaults<K>(this K state, object defaults) where K : FluentState
		{
			foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(defaults))
			{
				if (defaultProperty.GetValue(defaults) != null)
					state.AddDefault(defaultProperty.Name, defaultProperty.GetValue(defaults));
			}
			return state;
		}

		public static K Derived<K>(this K state, params string[] derived) where K : FluentState
		{
			foreach (var key in derived)
			{
				if (string.IsNullOrEmpty(key))
					throw new ArgumentException("key");
				state.AddDerived(key);
			}
			return state;
		}

		public static K Attribute<K>(this K state, string key, string value) where K : FluentState
		{
			state.AddAttribute(key, value);
			return state;
		}

		public static K CheckPhysicalUrlAccess<K>(this K state, bool check) where K : WebFormsState
		{
			state.AddAttribute("checkPhysicalUrlAccess", check ? "true" : "false");
			return state;
		}
	}
}
