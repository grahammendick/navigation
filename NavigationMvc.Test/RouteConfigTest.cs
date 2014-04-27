using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Routing;

namespace Navigation.Mvc.Test
{
	[TestClass]
	public class RouteConfigTest
	{
		[TestMethod]
		public void RouteTest()
		{
			Assert.AreEqual(4, RouteTable.Routes.Count);
		}

		[TestMethod]
		public void MvcStateRouteHandlerTest()
		{
			MvcStateRouteHandler handler = ((Route)RouteTable.Routes["Mvc0-0"]).RouteHandler as MvcStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes["Mvc0-1"]).RouteHandler as MvcStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes[2]).RouteHandler as MvcStateRouteHandler;
			Assert.IsNotNull(handler);
			handler = ((Route)RouteTable.Routes[3]).RouteHandler as MvcStateRouteHandler;
			Assert.IsNull(handler);
		}
	}
}
