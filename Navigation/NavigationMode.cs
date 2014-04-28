namespace Navigation
{
	/// <summary>
	/// Determines how a navigation performed by the <see cref="Navigation.StateController"/> is executed
	/// </summary>
	public enum NavigationMode
	{
		/// <summary>
		/// Navigates via a <see cref="System.Web.HttpResponse.Redirect(string, bool)">Response Redirect</see>
		/// and ends the response
		/// </summary>
		Client,
		/// <summary>
		/// Navigates via a <see cref="System.Web.HttpResponse.Redirect(string, bool)">Response Redirect</see>
		/// without ending the response
		/// </summary>
		ClientNoAbort,
		/// <summary>
		/// Navigates via a <see cref="System.Web.HttpServerUtility.Transfer(string)">Server Transfer</see>
		/// </summary>
		Server,
		/// <summary>
		/// Navigates without executing a request for the new <see cref="Navigation.State"/>. This mode is 
		/// automatically used in a Unit Test environment but can be manually used in a Web environment
		/// </summary>
		Mock
	}
}
