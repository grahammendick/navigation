using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Navigation.Sample.Test
{
	[TestClass]
	public class StateInfoTest
	{
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

		[TestMethod]
		public void NavigateMvcPersonTest()
		{
			StateController.Navigate("MvcPerson");
			Assert.AreEqual("Listing", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateMvcListingSelectTest()
		{
			StateController.Navigate("MvcPerson");
			StateController.Navigate("Select");
			Assert.AreEqual("Details", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateMvcPersonLinkTest()
		{
			string link = StateController.GetNavigationLink("MvcPerson");
			Assert.AreEqual("/MvcList", link);
		}

		[TestMethod]
		public void NavigateMvcPersonStartRowIndexLinkTest()
		{
			NavigationData data = new NavigationData();
			data["startRowIndex"] = 10;
			string link = StateController.GetNavigationLink("MvcPerson", data);
			Assert.AreEqual("/MvcList/10", link);
		}

		[TestMethod]
		public void NavigateMvcPersonMaximumRowsLinkTest()
		{
			NavigationData data = new NavigationData();
			data["maximumRows"] = 20;
			string link = StateController.GetNavigationLink("MvcPerson", data);
			Assert.AreEqual("/MvcList/0/20", link);
		}

		[TestMethod]
		public void NavigateWebApiPersonTest()
		{
			StateController.Navigate("WebApiPerson");
			Assert.AreEqual("Listing", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateWebApiListingSelectTest()
		{
			StateController.Navigate("WebApiPerson");
			StateController.Navigate("Select");
			Assert.AreEqual("Details", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateWebApiPersonLinkTest()
		{
			string link = StateController.GetNavigationLink("WebApiPerson");
			Assert.AreEqual("/WebApiList", link);
		}

		[TestMethod]
		public void NavigateWebApiPersonStartRowIndexLinkTest()
		{
			NavigationData data = new NavigationData();
			data["startRowIndex"] = 10;
			string link = StateController.GetNavigationLink("WebApiPerson", data);
			Assert.AreEqual("/WebApiList/10", link);
		}

		[TestMethod]
		public void NavigateWebApiPersonMaximumRowsLinkTest()
		{
			NavigationData data = new NavigationData();
			data["maximumRows"] = 20;
			string link = StateController.GetNavigationLink("WebApiPerson", data);
			Assert.AreEqual("/WebApiList/0/20", link);
		}
	}
}
