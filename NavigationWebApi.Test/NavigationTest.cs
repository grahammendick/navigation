using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Navigation.WebApi.Test
{
	[TestClass]
	public class NavigationTest
	{
		[AssemblyInitialize]
		public static void AddStateRoutes(TestContext context)
		{
			WebApiRouteConfig.AddHttpRoutes();
			StateController.Navigate("d0");
		}

		[TestMethod]
		public void NavigateTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			Assert.AreEqual("s1", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateBackTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			Assert.AreEqual("s1", StateContext.State.Key);
		}

		[TestMethod]
		public void RefreshTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Refresh();
			Assert.AreEqual("s2", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateLinkTest()
		{
			StateController.Navigate("d0");
			Assert.AreEqual("/r1", StateController.GetNavigationLink("t0"));
		}

		[TestMethod]
		public void NavigateBackLinkTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("/r1", StateController.GetNavigationBackLink(1));
		}

		[TestMethod]
		public void RefreshLinkTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			Assert.AreEqual("/r1", StateController.RefreshLink);
		}

		[TestMethod]
		public void NavigateWebApiToWebFormsTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("s3", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateDataTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		public void NavigateBackDataTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		public void RefreshDataTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Refresh(new NavigationData { { "a", 1 } });
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		public void NavigateWebApiToWebFormsDataTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			Assert.AreEqual(1, StateContext.Bag.a);
		}
	}
}
