#if NET40Plus
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Web.Mvc;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class ActionResultTest
	{
		private static ControllerContext GetControllerContext(bool childAction)
		{
			var context = new Mock<ControllerContext>();
			context.Setup(c => c.IsChildAction).Returns(childAction);
			return context.Object;
		}

		[TestMethod]
		public void NavigateResultDialogTest()
		{
			NavigateResult result = new NavigateResult("d0");
			result.ExecuteResult(GetControllerContext(false));
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[0], StateContext.State);
		}

		[TestMethod]
		public void NavigateResultTransitionTest()
		{
			StateController.Navigate("d0");
			NavigateResult result = new NavigateResult("t0");
			result.ExecuteResult(GetControllerContext(false));
			Assert.AreEqual("s1", StateContext.State.Key);
		}

		[TestMethod]
		public void NavigateResultDataTest()
		{
			StateController.Navigate("d0");
			NavigateResult result = new NavigateResult("t0", new NavigationData { { "a", 1 } });
			result.ExecuteResult(GetControllerContext(false));
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void NavigateResultNullContextTest()
		{
			StateController.Navigate("d0");
			NavigateResult result = new NavigateResult("t0");
			result.ExecuteResult(null);
		}

		[TestMethod]
		[ExpectedException(typeof(InvalidOperationException))]
		public void NavigateResultChildActionTest()
		{
			StateController.Navigate("d0");
			NavigateResult result = new NavigateResult("t0");
			result.ExecuteResult(GetControllerContext(true));
		}

		[TestMethod]
		public void NavigateBackResultTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			NavigateBackResult result = new NavigateBackResult(1);
			result.ExecuteResult(GetControllerContext(false));
			Assert.AreEqual("s1", StateContext.State.Key);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void NavigateBackResultNullContextTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			NavigateBackResult result = new NavigateBackResult(1);
			result.ExecuteResult(null);
		}

		[TestMethod]
		[ExpectedException(typeof(InvalidOperationException))]
		public void NavigateBackResultChildActionTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			NavigateBackResult result = new NavigateBackResult(1);
			result.ExecuteResult(GetControllerContext(true));
		}

		[TestMethod]
		public void RefreshResultTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			RefreshResult result = new RefreshResult();
			result.ExecuteResult(GetControllerContext(false));
			Assert.AreEqual("s1", StateContext.State.Key);
			Assert.IsNull(StateContext.Bag.a);
		}

		[TestMethod]
		public void RefreshResultDataTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			RefreshResult result = new RefreshResult(new NavigationData { { "a", 1 } });
			result.ExecuteResult(GetControllerContext(false));
			Assert.AreEqual("s1", StateContext.State.Key);
			Assert.AreEqual(1, StateContext.Bag.a);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void RefreshResultNullContextTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			RefreshResult result = new RefreshResult();
			result.ExecuteResult(null);
		}

		[TestMethod]
		[ExpectedException(typeof(InvalidOperationException))]
		public void RefreshResultChildActionTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			RefreshResult result = new RefreshResult();
			result.ExecuteResult(GetControllerContext(true));
		}
	}
}
#endif
