using System.ComponentModel;

namespace Navigation
{
	public static class FluentExtensions
	{
		public static K Defaults<K>(this K state, object defaults) where K : FluentState
		{
			foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(defaults))
			{
				state.AddDefault(defaultProperty.Name, defaultProperty.GetValue(defaults));
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
