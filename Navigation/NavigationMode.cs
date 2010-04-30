namespace Navigation
{
	/// <summary>
	/// Determines how a navigation performed by the <see cref="Navigation.StateController"/> is executed
	/// </summary>
	public enum NavigationMode
	{
		/// <summary>
		/// Navigates via a <see cref="System.Web.HttpResponse.Redirect(string, bool)">Response Redirect</see>
		/// </summary>
		Client,
		/// <summary>
		/// Navigates via a <see cref="System.Web.HttpServerUtility.Transfer(string)">Server Transfer</see>
		/// </summary>
		Server,
		/// <summary>
		/// Navigates without executing a request for the new <see cref="System.Web.UI.Page"/>. This mode is 
		/// automatically used in a Unit Test environment but can be manually used in a Web environment
		/// </summary>
		Mock
	}
}
