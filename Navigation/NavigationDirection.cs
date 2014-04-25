namespace Navigation
{
	/// <summary>
	/// Specifies the direction of navigation performed by the <see cref="Navigation.StateController"/>.
	/// </summary>
	public enum NavigationDirection
	{
		/// <summary>
		/// Navigates either to the 'to' <see cref="Navigation.State"/> of a <see cref="Navigation.Transition"/>
		/// or the 'initial' <see cref="Navigation.State"/> of a <see cref="Navigation.Dialog"/>
		/// </summary>
		Forward,
		/// <summary>
		/// Navigates back to the <see cref="Navigation.Crumb"/> contained in the crumb trail, represented by
		/// the <see cref="Navigation.StateController.Crumbs"/> collection
		/// </summary>
		Back,
		/// <summary>
		///  Navigates to the current <see cref="Navigation.State"/>
		/// </summary>
		Refresh,
	}
}
