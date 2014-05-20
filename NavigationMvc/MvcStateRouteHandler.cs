using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Navigation.Mvc
{
	/// <summary>
	/// Creates the <see cref="StateContext"/> for the MVC <see cref="State"/>
	/// </summary>
	public class MvcStateRouteHandler : MvcRouteHandler
	{
		private MvcStateRouteHandler()
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="MvcStateRouteHandler"/> class
		/// </summary>
		/// <param name="state">The <see cref="State"/> this route handler is associated with</param>
		protected internal MvcStateRouteHandler(State state)
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
			var currentUrl = requestContext.HttpContext.Request.Headers["Navigation-Link"];
			if (currentUrl != null)
			{
				StateController.NavigateLink(currentUrl, State, NavigationMode.Mock);
				RefreshAjaxInfo.GetInfo(requestContext.HttpContext).Data = new NavigationData(true);
			}
			StateController.SetStateContext(State.Id, requestContext.HttpContext);
			return base.GetHttpHandler(requestContext);
		}
	}
}
