using System.Collections.Specialized;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// Defines a contract a class must implement in order to build and parse navigation links.
	/// </summary>
	public interface IStateHandler
	{
#if NET40Plus
		/// <summary>
		/// Returns a link that navigates to the <paramref name="state"/> passing the <paramref name="data"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="data">The data to pass when navigating</param>
		/// <param name="context">The current context</param>
		/// <returns>The navigation link</returns>
		string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context);

		/// <summary>
		/// Returns the data parsed from the <paramref name="context"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> navigated to</param>
		/// <param name="context">The current context</param>
		/// <returns>The navigation data</returns>
		NameValueCollection GetNavigationData(State state, HttpContextBase context);
#else
		string GetNavigationLink(State state, NameValueCollection data, HttpContext context);

		NameValueCollection GetNavigationData(State state, NameValueCollection data);
#endif
	}
}
