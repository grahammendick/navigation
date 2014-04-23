using System.Web;

namespace Navigation.Mvc
{
	public class MvcStateHandler : StateHandler
	{
		protected override string GetRoute(State state, HttpContextBase context)
		{
			return "Mvc" + state.Id;
		}
	}
}
