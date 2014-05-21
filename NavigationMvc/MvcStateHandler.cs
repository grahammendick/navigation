using System.Collections.Specialized;
using System.Web;

namespace Navigation.Mvc
{
	/// <summary>
	/// Implementation of <see cref="Navigation.IStateHandler"/> that builds and parses
	/// navigation links for an MVC <see cref="Navigation.State"/>
	/// </summary>
	public class MvcStateHandler : StateHandler
	{
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
			data.Remove("refreshajax");
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
			return "Mvc" + state.Id;
		}
	}
}
