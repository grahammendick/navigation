using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Navigation.Sample.Test
{
	[TestClass]
	public class StateInfoTest
	{
		[AssemblyInitialize]
		public static void AddStateRoutes(TestContext context)
		{
			PageRouteConfig.AddStateRoutes();
		}

		[TestMethod]
		public void NavigatePersonTest()
		{
			StateController.Navigate("Person");
			Assert.AreEqual("Listing", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateListingSelectTest()
		{
			StateController.Navigate("Person");
			StateController.Navigate("Select");
			Assert.AreEqual("Details", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigatePersonLinkTest()
		{
			string link = StateController.GetNavigationLink("Person");
			Assert.AreEqual("/List", link);
		}

		[TestMethod]
		public void NavigatePersonStartRowIndexLinkTest()
		{
			NavigationData data = new NavigationData();
			data["startRowIndex"] = 10;
			string link = StateController.GetNavigationLink("Person", data);
			Assert.AreEqual("/List/10", link);
		}

		[TestMethod]
		public void NavigatePersonMaximumRowsLinkTest()
		{
			NavigationData data = new NavigationData();
			data["maximumRows"] = 20;
			string link = StateController.GetNavigationLink("Person", data);
			Assert.AreEqual("/List/0/20", link);
		}
	}
}
