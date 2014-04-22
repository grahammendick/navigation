using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Navigation.Mvc
{
	public class MvcStateRouteHandler : MvcRouteHandler
	{
		private MvcStateRouteHandler()
		{
		}

		protected internal MvcStateRouteHandler(State state)
		{
			State = state;
		}

		public State State
		{
			get;
			private set;
		}

		protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
		{
			StateContext.StateId = State.Id;
			StateController.SetStateContext(requestContext.HttpContext);
			StateContext.Data["controller"] = null;
			StateContext.Data["action"] = null;
			return base.GetHttpHandler(requestContext);
		}
	}
}
