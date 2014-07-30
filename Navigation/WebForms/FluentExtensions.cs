namespace Navigation
{
	public static partial class FluentExtensions
	{
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
