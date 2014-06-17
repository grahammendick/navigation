using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Routing;

namespace Navigation.Test.WebApi
{
	[TestClass]
	public class RouteConfigTest
	{
		[TestMethod]
		public void WebApiStateRouteHandlerTest()
		{
			WebApiStateRouteHandler handler = ((Route)RouteTable.Routes["WebApi8-0"]).RouteHandler as WebApiStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes["WebApi8-1"]).RouteHandler as WebApiStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes["WebApi8-2"]).RouteHandler as WebApiStateRouteHandler;
			Assert.IsNotNull(handler);
		}
	}
}
