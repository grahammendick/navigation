using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;

namespace Navigation.WebApi
{
	public class WebApiStateRouteHandler : HttpControllerRouteHandler
	{
		private WebApiStateRouteHandler()
		{
		}

		protected internal WebApiStateRouteHandler(State state)
		{

		}

		public State State
		{
			get;
			private set;
		}

		protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
		{
			StateController.SetStateContext(State.Id, requestContext.HttpContext);
			return base.GetHttpHandler(requestContext);
		}
	}
}
