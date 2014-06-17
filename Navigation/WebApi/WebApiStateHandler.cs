using System.Collections.Specialized;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// Implementation of <see cref="Navigation.IStateHandler"/> that builds and parses
	/// navigation links for an Web Api <see cref="Navigation.State"/>
	/// </summary>
	public class WebApiStateHandler : StateHandler
	{
		/// <summary>
		/// Gets a routed link that navigates to the <paramref name="state"/> passing 
		/// the <paramref name="data"/> with the httproute key removed
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="data">The data to pass when navigating</param>
		/// <param name="context">The current context</param>
		/// <returns>The routed navigation link</returns>
		public override string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			data["httproute"] = "";
			return base.GetNavigationLink(state, data, context);
		}

		/// <summary>
		/// Gets the data parsed from the Route and QueryString of the <paramref name="context"/>
		/// with the controller and action Route defaults removed
		/// </summary>
		/// <param name="state">The <see cref="State"/> navigated to</param>
		/// <param name="context">The current context</param>
		/// <returns>The navigation data</returns>
		public override NameValueCollection GetNavigationData(State state, HttpContextBase context)
		{
			NameValueCollection data = base.GetNavigationData(state, context);
			data.Remove("controller");
			data.Remove("action");
			return data;
		}

		/// <summary>
		/// Returns the route name of the <paramref name="state"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="context">The current context</param>
		/// <returns>The route name</returns>
		protected override string GetRouteName(State state, HttpContextBase context)
		{
			return "WebApi" + state.Id;
		}
	}
}
