using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;

namespace Navigation
{
	/// <summary>
	/// Creates the <see cref="StateContext"/> for the Web Api <see cref="State"/>
	/// </summary>
	public class WebApiStateRouteHandler : HttpControllerRouteHandler
	{
		private WebApiStateRouteHandler()
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="WebApiStateRouteHandler"/> class
		/// </summary>
		/// <param name="state">The <see cref="State"/> this route handler is associated with</param>
		protected internal WebApiStateRouteHandler(State state)
		{
			State = state;
		}

		/// <summary>
		/// Gets the <see cref="State"/> this route handler is associated with
		/// </summary>
		public State State
		{
			get;
			private set;
		}

		/// <summary>
		/// Returns the object that processes the request
		/// </summary>
		/// <param name="requestContext">An object that encapsulates information about the request</param>
		/// <returns>The object that processes the request</returns>
		protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
		{
			StateController.SetStateContext(State.Id, requestContext.HttpContext);
			return base.GetHttpHandler(requestContext);
		}
	}
}
