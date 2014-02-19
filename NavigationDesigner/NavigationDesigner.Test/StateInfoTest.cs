using Microsoft.VisualStudio.Modeling;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Navigation.Designer;
using System.Collections.Generic;
using System.Linq;

namespace NavigationDesigner.Test
{
	[TestClass]
	public class StateInfoTest
	{
		private static NavigationDiagram LoadModel(string navigationModel)
		{
			Store store = new Store(typeof(NavigationLanguageDomainModel));
			NavigationDiagram navigationConfiguration;
			using (Transaction t = store.TransactionManager.BeginTransaction())
			{
				navigationConfiguration = NavigationLanguageSerializationHelper.Instance.LoadModel(store, navigationModel, null, null, null);
				t.Commit();
			}
			return navigationConfiguration;
		}

		private static bool ValidateNavigation(NavigationDiagram navigationConfiguration, List<Dialog> dialogs)
		{
			var unconvertedNavigations =
				from s in navigationConfiguration.States
				from su in s.Successors
				let c = GetStateWrappersCanNavigateTo(dialogs, s, su).Count()
				where (c > 0 && c < GetStateWrappers(dialogs, s).Count())
				|| (c == 0 && dialogs.Where(d => d.Initial == su).FirstOrDefault() == null)
				|| (c == 0 && Transition.GetLink(s, su).CanNavigateBack)
				select s;
			var unconvertedInitialStates =
				from s in navigationConfiguration.States
				where s.Initial
				&& dialogs.Where(d => d.Initial == s).FirstOrDefault() == null
				select s;
			return unconvertedNavigations.FirstOrDefault() == null && unconvertedInitialStates.FirstOrDefault() == null;
		}

		private static bool ValidateTransition(NavigationDiagram navigationConfiguration, List<Dialog> dialogs)
		{
			var invalidTransitions =
				from d in dialogs
				from s in d.States
				from t in s.Transitions
				let n = Transition.GetLink(s.State, t.To.State)
				where n == null || n.Key != t.Key
				select t;
			return invalidTransitions.FirstOrDefault() == null;
		}

		private static IEnumerable<StateWrapper> GetStateWrappersCanNavigateTo(List<Dialog> dialogs, State state, State successor)
		{
			return from sw in GetStateWrappers(dialogs, state)
				   where sw.CanNavigateTo(successor, Transition.GetLink(state, successor).Key)
				   select sw;
		}

		private static IEnumerable<StateWrapper> GetStateWrappers(List<Dialog> dialogs, State state)
		{
			return from d in dialogs
				   from s in d.States
				   where s.State == state
				   select s;
		}

		[TestMethod]
		public void AnBnC_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnC.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void A_B_C_Makes_3_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/A_B_C.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
		}

		[TestMethod]
		public void AnB_CnD_Makes_2_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnB_CnD.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(2, dialogs.Count());
		}

		[TestMethod]
		public void AnB_An1C_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnB_An1C.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnB_CnB_Makes_3_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnB_CnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
		}

		[TestMethod]
		public void AnbB_CnB_Makes_2_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnbB_CnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(2, dialogs.Count());
		}

		[TestMethod]
		public void AnbB_CnbB_Makes_2_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnbB_CnbB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(2, dialogs.Count());
		}

		[TestMethod]
		public void AnbB_CnbB_Bi_Makes_3_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnbB_CnbB_Bi.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnA_Makes_1_Dialog_A()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnA.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
			Assert.IsNotNull(dialogs.Where(d => d.Initial.Key == "A").FirstOrDefault());
		}

		[TestMethod]
		public void AnBnCnA_Bi_Makes_1_Dialog_B()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnA_Bi.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
			Assert.IsNotNull(dialogs.Where(d => d.Initial.Key == "B").FirstOrDefault());
		}

		[TestMethod]
		public void AnBnCnDnB_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnDnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnA_DnB_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnA_DnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnBnbCnA_DnbB_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnbCnA_DnbB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnB_CnB_BnD_EnDnF_Makes_5_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnB_CnB_BnD_EnDnF.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(5, dialogs.Count());
		}

		[TestMethod]
		public void AnB_CnBnDnB_Makes_3_Dialogs_Not_D()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnB_CnBnDnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
			Assert.IsNull(dialogs.Where(d => d.Initial.Key == "D").FirstOrDefault());
		}

		[TestMethod]
		public void AnbB_CnBnDnB_Makes_3_Dialogs_Not_B()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnbB_CnBnDnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
			Assert.IsNull(dialogs.Where(d => d.Initial.Key == "B").FirstOrDefault());
		}

		[TestMethod]
		public void AnbB_CnBnDnB_Makes_3_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnbB_CnBnDnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
		}

		[TestMethod]
		public void AnbB_CnBnbDnB_Makes_2_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnbB_CnBnbDnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(2, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnDnB_Cn1EnFnGnHnF_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnDnB_Cn1EnFnGnHnF.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnAn1Cn1Bn1A_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnAn1Cn1Bn1A.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnBnC_AiBi_Makes_2_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnC_AiBi.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(2, dialogs.Count());
		}

		[TestMethod]
		public void AnBnC_AiBiCi_Makes_3_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnC_AiBiCi.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
		}

		[TestMethod]
		public void AnBnDnB_CnbD_Di_Makes_4_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnDnB_CnbD_Di.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(4, dialogs.Count());
		}

		[TestMethod]
		public void AnbBnbCnbDnbC_Bi_Makes_2_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnbBnbCnbDnbC_Bi.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(2, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnAn1Cn1Bn1An1C_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnAn1Cn1Bn1An1C.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnAn1Cn1B_Ci_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnAn1Cn1B_Ci.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void BnCnBn1A_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/BnCnBn1A.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void BnCnBn1bA_DnA_EnA_Makes_4_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/BnCnBn1bA_DnA_EnA.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(4, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnC_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnC.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnCn1A_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnCn1A.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnbBnB_CnB_Makes_2_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnbBnB_CnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(2, dialogs.Count());
		}

		[TestMethod]
		public void AnBnB_CnB_Makes_3_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnB_CnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
		}

		[TestMethod]
		public void AnBnbB_CnB_Makes_3_Dialogs()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnbB_CnB.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(3, dialogs.Count());
		}

		[TestMethod]
		public void AnBnCnDnBn1B_Cn1C_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnBnCnDnBn1B_Cn1C.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}

		[TestMethod]
		public void AnA_Makes_1_Dialog()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/AnA.nav");
			List<Dialog> dialogs = new StateInfo().Convert(navigationConfiguration);
			Assert.IsTrue(ValidateNavigation(navigationConfiguration, dialogs));
			Assert.IsTrue(ValidateTransition(navigationConfiguration, dialogs));
			Assert.AreEqual(1, dialogs.Count());
		}
	}
}
