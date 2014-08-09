namespace Navigation
{
	public static partial class FluentExtensions
	{
		/// <summary>
		/// Sets the Url that will cause a navigation to the initial <see cref="State"/>
		/// </summary>
		/// <typeparam name="TStates">Type holding the <see cref="FluentState"/> children</typeparam>
		/// <typeparam name="TInitial">Selects the state to navigate to</typeparam>
		/// <param name="dialog">The <see cref="FluentDialog"/></param>
		/// <param name="path">The Url for initial navigation</param>
		/// <returns>The <see cref="FluentDialog"/></returns>
		public static FluentDialog<TStates, TInitial> Path<TStates, TInitial>(this FluentDialog<TStates, TInitial> dialog, string path)
			where TStates : class
			where TInitial : FluentState
		{
			dialog.AddAttribute("path", path);
			return dialog;
		}

#if NET40Plus
		/// <summary>
		/// Sets a value that indicates whether ASP.NET should validate that the user has authority to access the 
		/// physical page
		/// </summary>
		/// <typeparam name="K">The type of the <see cref="FluentState"/></typeparam>
		/// <param name="state">The <see cref="FluentState"/></param>
		/// <param name="check">Authority validation indicator</param>
		/// <returns>The <see cref="FluentState"/></returns>
		public static K CheckPhysicalUrlAccess<K>(this K state, bool check) where K : WebFormsState
		{
			state.AddAttribute("checkPhysicalUrlAccess", check ? "true" : "false");
			return state;
		}
#endif
	}
}
