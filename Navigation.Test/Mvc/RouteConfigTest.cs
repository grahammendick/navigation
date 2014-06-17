using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Routing;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class RouteConfigTest
	{
		[TestMethod]
		public void MvcStateRouteHandlerTest()
		{
			MvcStateRouteHandler handler = ((Route)RouteTable.Routes["Mvc7-0"]).RouteHandler as MvcStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes["Mvc7-1"]).RouteHandler as MvcStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes["Mvc7-2"]).RouteHandler as MvcStateRouteHandler;
			Assert.IsNotNull(handler);
		}
	}
}
