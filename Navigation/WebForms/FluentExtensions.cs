namespace Navigation
{
	public static partial class FluentExtensions
	{
		public static FluentDialog<UStates, UInitial> Path<UStates, UInitial>(this FluentDialog<UStates, UInitial> dialog, string path)
			where UStates : class
			where UInitial : FluentState
		{
			dialog.AddAttribute("path", path);
			return dialog;
		}

#if NET40Plus
		public static K CheckPhysicalUrlAccess<K>(this K state, bool check) where K : WebFormsState
		{
			state.AddAttribute("checkPhysicalUrlAccess", check ? "true" : "false");
			return state;
		}
#endif
	}
}
