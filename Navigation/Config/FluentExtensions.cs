namespace Navigation
{
	public static class FluentExtensions
	{
		public static K Defaults<K>(this K state, object defaults) where K : FluentState
		{
			state.Defaults = defaults;
			return state;
		}

		public static K CheckPhysicalUrlAccess<K>(this K state, bool check) where K : WebFormsState
		{
			state.AddAttribute("checkPhysicalUrlAccess", check ? "true" : "false");
			return state;
		}
	}
}
