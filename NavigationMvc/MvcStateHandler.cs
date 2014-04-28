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
		/// Returns the route of the <paramref name="state"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="context">The current context</param>
		/// <returns>The route name</returns>
		protected override string GetRoute(State state, HttpContextBase context)
		{
			return "Mvc" + state.Id;
		}
	}
}
