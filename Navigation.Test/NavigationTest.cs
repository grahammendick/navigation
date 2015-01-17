using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Web.UI;

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

		[TestInitialize]
		public void Initialize()
		{
			StateContext.Data.Clear();
		}

		[TestMethod]
		public void NavigateDialogTest()
		{
			StateController.Navigate("d0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].Initial, StateContext.State);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateDialogRouteTest()
		{
			StateController.Navigate("d3");
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].Initial, StateContext.State);
			Assert.AreEqual(0, StateController.Crumbs.Count);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateInvalidDialogTest()
		{
			StateController.Navigate("d9");
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
		public void NavigateCrossDialogRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Navigate("d4");
			Assert.AreEqual(StateInfoConfig.Dialogs["d4"].Initial, StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s1"], StateContext.PreviousState);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"], StateContext.PreviousDialog);
			Assert.AreEqual(StateInfoConfig.Dialogs["d4"].States["s0"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d4"], StateContext.Dialog);
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
		public void NavigateCrossDialogWithoutTrailRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Navigate("d5");
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].Initial, StateContext.State);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s0"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"], StateContext.Dialog);
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
		public void NavigateDialogDialogRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("d3");
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].Initial, StateContext.State);
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
		public void NavigateDialogDialogWithoutTrailRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("d5");
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].Initial, StateContext.State);
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
		public void NavigateTransitionRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s1"], StateContext.State);
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
		public void NavigateTransitionFromWithoutTrailRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s1"], StateContext.State);
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
		public void NavigateTransitionTransitionRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t1");
			StateController.Navigate("t1");
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s4"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s2"], StateContext.PreviousState);
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
		public void NavigateTransitionTransitionToWithoutTrailRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s2"], StateContext.State);
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
		public void RefreshRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs[3].States[1], StateContext.State);
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
		public void RefreshWithoutTrailRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs[5].States[2], StateContext.State);
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
		public void NavigateBackOneRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t2");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs[3].States[0], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs[3].States[3], StateContext.PreviousState);
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
		public void NavigateBackOneWithoutTrailRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs[5].States[2], StateContext.State);
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
		public void NavigateBackTwoRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(2);
			Assert.AreEqual(StateInfoConfig.Dialogs[3].States[2], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs[3].States[4], StateContext.PreviousState);
			Assert.AreEqual(2, StateController.Crumbs.Count);
			Assert.IsFalse(StateController.Crumbs[0].Last);
			Assert.IsTrue(StateController.Crumbs[1].Last);
			int i = 0;
			foreach (Crumb crumb in StateController.Crumbs)
			{
				Assert.AreEqual(StateInfoConfig.Dialogs[3].States[i], crumb.State);
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
		public void NavigateBackTwoWithoutTrailRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(2);
			Assert.AreEqual(StateInfoConfig.Dialogs[5].States[4], StateContext.State);
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
		public void NavigateBackOneByOneRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t1");
			StateController.Navigate("t1");
			StateController.NavigateBack(1);
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs[3].States[0], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs[3].States[0].Parent, StateContext.Dialog);
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
		public void NavigateBackOneByOneWithoutTrailRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs[5].States[4], StateContext.State);
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
		public void NavigateCanNavigateBackRouteTest()
		{
			StateController.Navigate("d3");
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
		public void NavigateWithoutTrailCanNavigateBackRouteTest()
		{
			StateController.Navigate("d5");
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
		public void NavigateBackInvalidRouteTest()
		{
			StateController.Navigate("d3");
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
		public void NavigateWithoutTrailBackInvalidRouteTest()
		{
			StateController.Navigate("d5");
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
		public void NavigateBackNavigateBackInvalidRouteTest()
		{
			StateController.Navigate("d3");
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
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateBackNavigateBackWithoutTrailInvalidRouteTest()
		{
			StateController.Navigate("d5");
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
		public void NavigateBackRefreshRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t3");
			StateController.NavigateBack(1);
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs[3].Initial, StateContext.State);
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
		public void NavigateBackWithoutTrailRefreshRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs[5].Initial, StateContext.State);
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
		public void NavigateBackRefreshTransitionRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Navigate("t2");
			StateController.NavigateBack(1);
			StateController.Refresh();
			StateController.Navigate("t1");
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s3"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s1"], StateContext.PreviousState);
			Assert.AreEqual(2, StateController.Crumbs.Count);
			Assert.IsFalse(StateController.Crumbs[0].Last);
			Assert.IsTrue(StateController.Crumbs[1].Last);
			int i = 0;
			foreach (Crumb crumb in StateController.Crumbs)
			{
				Assert.AreEqual(StateInfoConfig.Dialogs[3].States[i], crumb.State);
				Assert.AreEqual(StateInfoConfig.Dialogs[3].States[i].Title, crumb.Title);
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
		public void NavigateBackWithoutTrailRefreshTransitionRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			StateController.Refresh();
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s3"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s2"], StateContext.PreviousState);
			Assert.AreEqual(1, StateController.Crumbs.Count);
			Assert.IsTrue(StateController.Crumbs[0].Last);
			Assert.AreEqual(StateInfoConfig.Dialogs[5].States[2], StateController.Crumbs[0].State);
			Assert.AreEqual(StateInfoConfig.Dialogs[5].States[2].Title, StateController.Crumbs[0].Title);
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
		public void NavigateTransitionWithoutTrailTransitionRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s3"], StateContext.State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s2"], StateContext.PreviousState);
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
		public void NavigateCrumbTrailRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s0"], StateController.Crumbs[0].State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s1"], StateController.Crumbs[1].State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s2"], StateController.Crumbs[2].State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s3"], StateController.Crumbs[3].State);
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
		public void NavigateTransitionGetNextStateRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			State state = StateController.GetNextState("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s2"], state);
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
		public void NavigateTransitionTransitionGetCrumbRouteTest()
		{
			StateController.Navigate("d4");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Crumb crumb = StateController.GetCrumb(1);
			Assert.AreEqual(StateInfoConfig.Dialogs["d4"].States["s1"], crumb.State);
		}

#if NET40Plus
		[TestMethod]
		public void NavigateLinkRouteTest()
		{
			string link = StateController.GetNavigationLink("d3");
			Assert.IsTrue(link.Contains("/d3s0?"));
		}

		[TestMethod]
		public void NavigateLinkRootRouteTest()
		{
			StateController.Navigate("d4");
			string link = StateController.GetNavigationLink("t0");
			Assert.IsTrue(link.StartsWith("/?"));
		}

		[TestMethod]
		public void NavigateLinkDefaultsRouteTest()
		{
			StateController.Navigate("d3");
			string link = StateController.GetNavigationLink("t0");
			Assert.IsTrue(link.Contains("/d3s1?"));
		}

		[TestMethod]
		public void NavigateLinkOptionalRouteTest()
		{
			StateController.Navigate("d3");
			string link = StateController.GetNavigationLink("t2");
			Assert.IsTrue(link.Contains("/d3s3?"));
		}

		[TestMethod]
		public void NavigateLinkDefaultsOptionalRouteTest()
		{
			StateController.Navigate("d3");
			string link = StateController.GetNavigationLink("t1");
			Assert.IsTrue(link.Contains("/d3s2/7/?"));
		}

		[TestMethod]
		public void NavigateLinkDefaultsAndOptionalRouteTest()
		{
			StateController.Navigate("d4");
			string link = StateController.GetNavigationLink("t0");
			Assert.IsTrue(link.Contains("/?"));
		}

		[TestMethod]
		public void NavigateLinkWithoutTrailChecksumSkippedRouteTest()
		{
			string link = StateController.GetNavigationLink("d5");
			Assert.AreEqual("/d5s0", link);
		}
#endif

		[TestMethod]
		public void NavigateDialogCustomStateHandlerTest()
		{
			StateController.Navigate("d6");
			Assert.AreEqual(StateInfoConfig.Dialogs["d6"].States["s0"], StateContext.State);
		}

		[TestMethod]
		public void NavigateTransitionCustomStateHandlerTest()
		{
			StateController.Navigate("d6");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d6"].States[1], StateContext.State);
		}

		[TestMethod]
		public void NavigateBackCustomStateHandlerTest()
		{
			StateController.Navigate("d6");
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs["d6"].States[0], StateContext.State);
		}

		[TestMethod]
		public void RefreshCustomStateHandlerTest()
		{
			StateController.Navigate("d6");
			StateController.Navigate("t0");
			StateController.Refresh();
			Assert.AreEqual(StateInfoConfig.Dialogs["d6"].States[1], StateContext.State);
		}

		[TestMethod]
		public void NavigateLinkCustomStateHandlerTest()
		{
			StateController.Navigate("d6");
			string link = StateController.GetNavigationLink("t0");
			Assert.IsTrue(link.EndsWith("custom"));
		}

		[TestMethod]
		public void NavigateDialogDialogCustomTrailTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("d6");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s0"], StateController.Crumbs[0].State);
			Assert.AreEqual(1, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateDialogTransitionDialogCustomTrailTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("d6");
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States["s0"], StateController.Crumbs[0].State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States[1], StateController.Crumbs[1].State);
			Assert.AreEqual(2, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateDialogDialogBackCustomTrailTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("d6");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States[0], StateContext.State);
		}

		[TestMethod]
		public void NavigateDialogTransitionDialogBackCustomTrailTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("d6");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs["d0"].States[1], StateContext.State);
		}

		[TestMethod]
		public void NavigateDialogDialogCustomTrailRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("d6");
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s0"], StateController.Crumbs[0].State);
			Assert.AreEqual(1, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateDialogTransitionDialogCustomTrailRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Navigate("d6");
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States["s0"], StateController.Crumbs[0].State);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States[1], StateController.Crumbs[1].State);
			Assert.AreEqual(2, StateController.Crumbs.Count);
		}

		[TestMethod]
		public void NavigateDialogDialogBackCustomTrailRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("d6");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States[0], StateContext.State);
		}

		[TestMethod]
		public void NavigateDialogTransitionDialogBackCustomTrailRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Navigate("d6");
			StateController.NavigateBack(1);
			Assert.AreEqual(StateInfoConfig.Dialogs["d3"].States[1], StateContext.State);
		}
		[TestMethod]
		public void NavigateTransitionRootRouteTest()
		{
			StateController.Navigate("d5");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual(StateInfoConfig.Dialogs["d5"].States["s2"], StateContext.State);
		}

		[TestMethod]
		public void NavigateServerTest()
		{
			StateController.Navigate("d0", NavigationMode.Server);
			StateController.Navigate("t0", NavigationMode.Server);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[1], StateContext.State);
		}

		[TestMethod]
		public void NavigateMockTest()
		{
			StateController.Navigate("d0", NavigationMode.Mock);
			StateController.Navigate("t0", NavigationMode.Mock);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[1], StateContext.State);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void NavigateLinkNullStateTest()
		{
			StateController.NavigateLink(null, StateController.GetNavigationLink("d0"));
		}

		[TestMethod]
		public void NavigateLinkTest()
		{
			StateController.Navigate("d0");
			StateController.NavigateLink(StateInfoConfig.Dialogs[0].States[1], StateController.GetNavigationLink("t0"));
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[1], StateContext.State);
		}

#if NET35Plus
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
#endif
	}
}
