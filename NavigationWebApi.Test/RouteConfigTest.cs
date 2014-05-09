using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Routing;

namespace Navigation.WebApi.Test
{
	[TestClass]
	public class RouteConfigTest
	{
		[AssemblyInitialize]
		public static void AddStateRoutes(TestContext context)
		{
			WebApiRouteConfig.AddHttpRoutes();
			StateController.Navigate("d0");
		}

		[TestMethod]
		public void RouteTest()
		{
			Assert.AreEqual(4, RouteTable.Routes.Count);
		}

		[TestMethod]
		public void WebApiStateRouteHandlerTest()
		{
			WebApiStateRouteHandler handler = ((Route)RouteTable.Routes["WebApi0-0"]).RouteHandler as WebApiStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes["WebApi0-1"]).RouteHandler as WebApiStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes[2]).RouteHandler as WebApiStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes[3]).RouteHandler as WebApiStateRouteHandler;
			Assert.IsNull(handler);
		}
	}
}
