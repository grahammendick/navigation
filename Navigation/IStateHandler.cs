using System.Collections.Specialized;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// Defines a contract a class must implement in order to build and parse navigation links
	/// </summary>
	public interface IStateHandler
	{
#if NET40Plus
		/// <summary>
		/// Gets a link that navigates to the <paramref name="state"/> passing the <paramref name="data"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="data">The data to pass when navigating</param>
		/// <param name="context">The current context</param>
		/// <returns>The navigation link</returns>
		string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context);

		/// <summary>
		/// Gets the data parsed from the <paramref name="context"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> navigated to</param>
		/// <param name="context">The current context</param>
		/// <returns>The navigation data</returns>
		NameValueCollection GetNavigationData(State state, HttpContextBase context);

		/// <summary>
		/// Navigates to the <paramref name="url"/> depending on the <paramref name="mode"/> specified
		/// </summary>
		/// <param name="state">The <see cref="State"/> to navigate to</param>
		/// <param name="url">The target location</param>
		/// <param name="mode">The navigation mode</param>
		/// <param name="context">The current context</param>
		void NavigateLink(State state, string url, NavigationMode mode, HttpContextBase context);
#else
		/// <summary>
		/// Gets a link that navigates to the <paramref name="state"/> passing the <paramref name="data"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="data">The data to pass when navigating</param>
		/// <returns>The navigation link</returns>
		string GetNavigationLink(State state, NameValueCollection data);

		/// <summary>
		/// Gets the data parsed from the <paramref name="data">context data</paramref>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> navigated to</param>
		/// <param name="data">The current context data</param>
		/// <returns>The navigation data</returns>
		NameValueCollection GetNavigationData(State state, NameValueCollection data);

		void NavigateLink(State state, string url, NavigationMode mode);
#endif
	}
}
