namespace Navigation
{
	public static class FluentExtensions
	{
		public static K Defaults<K>(this K state, object defaults) where K : FluentState
		{
			state.Defaults = defaults;
			return state;
		}

		public static K Theme<K>(this K state, string theme) where K : WebFormsState
		{
			state.Theme = theme;
			return state;
		}
	}
}
