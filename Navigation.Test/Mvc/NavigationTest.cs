#if NET40Plus
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class NavigationTest
	{
		[TestMethod]
		public void NavigateTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("s1", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateBackTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			Assert.AreEqual("s1", StateContext.State.Key);
		}

		[TestMethod]
		public void RefreshTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Refresh();
			Assert.AreEqual("s2", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateWebApiToWebFormsTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("s3", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateLinkTest()
		{
			StateController.Navigate("d7");
			Assert.AreEqual("/r1", StateController.GetNavigationLink("t0"));
		}

		[TestMethod]
		public void NavigateBackLinkTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("/r1", StateController.GetNavigationBackLink(1));
		}

		[TestMethod]
		public void RefreshLinkTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("/r1", StateController.RefreshLink);
		}

		[TestMethod]
		public void NavigateWebApiToWebFormsLinkTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.IsTrue(StateController.GetNavigationLink("t0").StartsWith("/r3"));
		}

		[TestMethod]
		public void NavigateDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		public void NavigateBackDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		public void RefreshDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Refresh(new NavigationData { { "a", 1 } });
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		public void NavigateWebApiToWebFormsDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		public void NavigateDefaultsTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual(0, StateContext.Bag.startRowIndex);
			Assert.AreEqual(10, StateContext.Bag.maximumRows);
		}
	}
}
#endif
