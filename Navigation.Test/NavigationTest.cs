using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Navigation;

namespace Navigation.Test
{
	[TestClass]
	public class NavigationTest
	{
		public NavigationTest()
		{
		}

		private TestContext testContextInstance;

		public TestContext TestContext
		{
			get
			{
				return testContextInstance;
			}
			set
			{
				testContextInstance = value;
			}
		}

		[TestMethod]
		public void NavigateDialogTest()
		{
			StateController.Navigate("d0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].Initial, StateContext.State);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateInvalidDialogTest()
		{
			StateController.Navigate("d3");
		}

		[TestMethod]
		public void NavigateCrossDialogTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("d1");
			Assert.AreEqual(StateInfoConfig.Dialogs["d1"].Initial, StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s1"], StateContext.PreviousState);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"], StateContext.PreviousDialog);
			Assert.AreEqual(StateInfoConfig.Dialogs["d1"].States["s0"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d1"], StateContext.Dialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateCrossDialogWithoutTrailTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("d2");
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].Initial, StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].States["s0"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"], StateContext.Dialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateDialogDialogTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("d0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].Initial, StateContext.State);
			Assert.AreEqual(StateContext.State, StateContext.PreviousState);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateDialogDialogWithoutTrailTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("d2");
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].Initial, StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateTransitionTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s1"], StateContext.State);
			Assert.AreEqual(StateContext.Dialog.Initial, StateContext.PreviousState);
			Assert.AreEqual(1, StateController.Crumbs.Count);
			Assert.AreEqual(StateContext.Dialog.Initial, StateController.Crumbs[0].State);
			Assert.IsTrue(StateController.Crumbs[0].Last);
		}

		[TestMethod]
		public void NavigateTransitionFromWithoutTrailTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].States["s1"], StateContext.State);
			Assert.AreEqual(StateContext.Dialog.Initial, StateContext.PreviousState);
			Assert.AreEqual(1, StateController.Crumbs.Count);
			Assert.AreEqual(StateContext.Dialog.Initial, StateController.Crumbs[0].State);
			Assert.IsTrue(StateController.Crumbs[0].Last);
		}

		[TestMethod]
		public void NavigateTransitionTransitionTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t1");
			StateController.Navigate("t1");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s4"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s2"], StateContext.PreviousState);
			Assert.AreEqual(2, StateController.Crumbs.Count);
			Assert.AreEqual(StateContext.Dialog.Initial, StateController.Crumbs[0].State);
			Assert.AreEqual(StateContext.PreviousState, StateController.Crumbs[1].State);
			Assert.IsFalse(StateController.Crumbs[0].Last);
			Assert.IsTrue(StateController.Crumbs[1].Last);
		}

		[TestMethod]
		public void NavigateTransitionTransitionToWithoutTrailTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].States["s2"], StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateInvalidActionTest()
		{
			StateController.Navigate("d1");
			StateController.Navigate("t1");
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void NavigateNullActionTest()
		{
			StateController.Navigate("d1");
			StateController.Navigate(null);
		}

		[TestMethod]
		public void RefreshTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[1], StateContext.State);
			Assert.AreEqual(StateContext.State, StateContext.PreviousState);
			Assert.AreEqual(1, StateController.Crumbs.Count);
			Assert.AreEqual(StateContext.Dialog.Initial, StateController.Crumbs[0].State);
			Assert.IsTrue(StateController.Crumbs[0].Last);
			Assert.IsNotNull(StateController.RefreshLink);
		}

		[TestMethod]
		public void RefreshWithoutTrailTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs[2].States[2], StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
			Assert.IsNotNull(StateController.RefreshLink);
		}

		[TestMethod]
		public void NavigateBackOneTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t2");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[0], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[3], StateContext.PreviousState);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateBackOneWithoutTrailTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs[2].States[2], StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateBackTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(2);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[2], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[4], StateContext.PreviousState);
			Assert.AreEqual(2, StateController.Crumbs.Count);
			Assert.IsFalse(StateController.Crumbs[0].Last);
			Assert.IsTrue(StateController.Crumbs[1].Last);
			int i = 0;
			foreach (Crumb crumb in StateController.Crumbs)
			{
				Assert.AreEqual(StateInfoConfig.Dialogs[0].States[i], crumb.State);
				i++;
			}
		}

		[TestMethod]
		public void NavigateBackTwoWithoutTrailTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(2);
			Assert.AreEqual(StateInfoConfig.Dialogs[2].States[4], StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateBackOneByOneTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t1");
			StateController.Navigate("t1");
			StateController.NavigateBack(1);
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[0], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[0].Parent, StateContext.Dialog);
			Assert.AreEqual(StateContext.State.Transitions[1].To, StateContext.PreviousState);
			Assert.AreEqual(StateContext.State.Transitions[1].To.Parent, StateContext.PreviousDialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateBackOneByOneWithoutTrailTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs[2].States[4], StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateCanNavigateBackTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t1");
			StateController.Navigate("t1");
			Assert.AreEqual(false, StateController.CanNavigateBack(0));
			Assert.AreEqual(true, StateController.CanNavigateBack(1));
			Assert.AreEqual(true, StateController.CanNavigateBack(2));
			Assert.AreEqual(false, StateController.CanNavigateBack(3));
		}

		[TestMethod]
		public void NavigateWithoutTrailCanNavigateBackTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual(false, StateController.CanNavigateBack(0));
			Assert.AreEqual(false, StateController.CanNavigateBack(1));
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateBackInvalidTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(3);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateWithoutTrailBackInvalidTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateBackNavigateBackInvalidTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			try
			{
				StateController.NavigateBack(1);
			}
			catch (ArgumentException) { };
			StateController.NavigateBack(2);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateBackNavigateBackWithoutTrailInvalidTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			try
			{
				StateController.NavigateBack(1);
			}
			catch (ArgumentException) { };
			StateController.NavigateBack(1);
		}

		[TestMethod]
		public void NavigateBackRefreshTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t3");
			StateController.NavigateBack(1);
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs[0].Initial, StateContext.State);
			Assert.AreEqual(StateContext.State, StateContext.PreviousState);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateBackWithoutTrailRefreshTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs[2].Initial, StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateBackRefreshTransitionTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t2");
			StateController.NavigateBack(1);
			StateController.Refresh();
			StateController.Navigate("t1");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s3"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s1"], StateContext.PreviousState);
			Assert.AreEqual(2, StateController.Crumbs.Count);
			Assert.IsFalse(StateController.Crumbs[0].Last);
			Assert.IsTrue(StateController.Crumbs[1].Last);
			int i = 0;
			foreach (Crumb crumb in StateController.Crumbs)
			{
				Assert.AreEqual(StateInfoConfig.Dialogs[0].States[i], crumb.State);
				Assert.AreEqual(StateInfoConfig.Dialogs[0].States[i].Title, crumb.Title);
				i++;
			}
		}

		[TestMethod]
		public void NavigateBackWithoutTrailRefreshTransitionTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			StateController.Refresh();
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].States["s3"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].States["s2"], StateContext.PreviousState);
			Assert.AreEqual(1, StateController.Crumbs.Count);
			Assert.IsTrue(StateController.Crumbs[0].Last);
			Assert.AreEqual(StateInfoConfig.Dialogs[2].States[2], StateController.Crumbs[0].State);
			Assert.AreEqual(StateInfoConfig.Dialogs[2].States[2].Title, StateController.Crumbs[0].Title);
		}

		[TestMethod]
		public void NavigateTransitionWithoutTrailTransitionTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].States["s3"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].States["s2"], StateContext.PreviousState);
			Assert.AreEqual(1, StateController.Crumbs.Count);
			Assert.IsTrue(StateController.Crumbs[0].Last);
		}

		[TestMethod]
		public void NavigateCrumbTrailTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s0"], StateController.Crumbs[0].State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s1"], StateController.Crumbs[1].State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s2"], StateController.Crumbs[2].State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s3"], StateController.Crumbs[3].State);
			Assert.AreEqual(4, StateController.Crumbs.Count);
			Assert.IsFalse(StateController.Crumbs[0].Last);
			Assert.IsFalse(StateController.Crumbs[1].Last);
			Assert.IsFalse(StateController.Crumbs[2].Last);
			Assert.IsTrue(StateController.Crumbs[3].Last);
		}

		[TestMethod]
		public void NavigateTransitionGetNextStateTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			State state = StateController.GetNextState("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d2"].States["s2"], state);
		}

		[TestMethod]
		public void NavigateTransitionTransitionGetCrumbTest()
		{
			StateController.Navigate("d1");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Crumb crumb = StateController.GetCrumb(1);
			Assert.AreEqual(StateInfoConfig.Dialogs["d1"].States["s1"], crumb.State);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void AddHistoryPointNullPageTest()
		{
			StateController.AddHistoryPoint(null, null);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void AddHistoryPointInvalidDataTest()
		{
			StateController.Navigate("d2");
			NavigationData data = new NavigationData();
			data["item"] = DateTimeOffset.MinValue;
			StateController.AddHistoryPoint(new Page(), data, null);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void NavigateHistoryNullDataTest()
		{
			StateController.NavigateHistory(null);
		}
	}
}
