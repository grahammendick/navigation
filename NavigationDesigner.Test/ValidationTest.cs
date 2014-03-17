using Microsoft.VisualStudio.Modeling;
using Microsoft.VisualStudio.Modeling.Validation;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Navigation.Designer;

namespace NavigationDesigner.Test
{
	[TestClass]
	public class ValidationTest
	{
		private static NavigationDiagram LoadModel(string navigationModel)
		{
			Store store = new Store(typeof(NavigationLanguageDomainModel));
			NavigationDiagram navigationConfiguration;
			using (Transaction t = store.TransactionManager.BeginTransaction("test", true))
			{
				navigationConfiguration = NavigationLanguageSerializationHelper.Instance.LoadModel(store, navigationModel, null, null, null);
				t.Commit();
			}
			return navigationConfiguration;
		}

		private bool ValidateValidationMessages<T>(ValidationMessage message, string code, params T[] elements) where T : ModelElement
		{
			bool valid = message.Code == code && message.ReferencedModelElements.Count == elements.Length;
			int i = 0;
			foreach (T element in elements)
			{
				valid = valid && message.ReferencedModelElements[i] == element;
				i++;
			}
			return valid;
		}

		[TestMethod]
		public void BlankStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/BlankState.nav");
			State state = navigationConfiguration.States[1];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Open);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StateKeyEmpty", state));
		}

		[TestMethod]
		public void PathsFormatStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/PathsFormatState.nav");
			State state = navigationConfiguration.States[0];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Menu);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(5, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StatePageInvalid", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[1], "StateMastersInvalid", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[2], "DialogPathInvalid", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[3], "StateMobilePageInvalid", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[4], "StateMobileMastersInvalid", state));
		}

		[TestMethod]
		public void TitleAndResourceStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/TitleAndResourceState.nav");
			State state = navigationConfiguration.States[0];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Open);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(2, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StateTitleAndResourceInvalid", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[1], "DialogTitleAndResourceInvalid", state));
		}

		[TestMethod]
		public void ResourceStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/ResourceState.nav");
			State state = navigationConfiguration.States[0];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Save);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(2, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StateResourceInvalid", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[1], "DialogResourceInvalid", state));
		}

		[TestMethod]
		public void DefaultsStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DefaultsState.nav");
			State state1 = navigationConfiguration.States[0];
			State state2 = navigationConfiguration.States[1];
			State state3 = navigationConfiguration.States[2];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Menu);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(3, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StateDefaultsInvalid", state1));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[1], "StateDefaultsInvalid", state2));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[2], "StateDefaultsInvalid", state3));
		}

		[TestMethod]
		public void DefaultTypesStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DefaultTypesState.nav");
			State state1 = navigationConfiguration.States[0];
			State state2 = navigationConfiguration.States[1];
			State state3 = navigationConfiguration.States[2];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Menu);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(3, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StateDefaultTypesInvalid", state1));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[1], "StateDefaultTypesInvalid", state2));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[2], "StateDefaultTypesInvalid", state3));
		}

		[TestMethod]
		public void DuplicateTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DuplicateTransition.nav");
			Transition transition1 = Transition.GetLink(navigationConfiguration.States[0], navigationConfiguration.States[1]);
			Transition transition2 = Transition.GetLink(navigationConfiguration.States[0], navigationConfiguration.States[2]);
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Open);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "DuplicateTransitionKey", transition1, transition2));
		}

		[TestMethod]
		public void DuplicateTransitionAcrossStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DuplicateTransitionAcrossState.nav");
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Open);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(0, validator.ErrorMessages.Count);
		}

		[TestMethod]
		public void BlankTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/BlankTransition.nav");
			Transition transition = Transition.GetLink(navigationConfiguration.States[0], navigationConfiguration.States[1]);
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Save);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "TransitionKeyEmpty", transition));
		}

		[TestMethod]
		public void NoBackToInitialTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/NoBackToInitialTransition.nav");
			Transition transition = Transition.GetLink(navigationConfiguration.States[1], navigationConfiguration.States[0]);
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Menu);
			Assert.AreEqual(1, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(0, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.WarningMessages[0], "TransitionWithoutBackToInitialState", transition));
		}

		[TestMethod]
		public void FromNoTrackBackTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/FromNoTrackBackTransition.nav");
			Transition transition = Transition.GetLink(navigationConfiguration.States[0], navigationConfiguration.States[1]);
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Open);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "TransitionWithBackToNoTrackState", transition));
		}

		[TestMethod]
		public void DuplicateDialogTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DuplicateDialog.nav");
			State state1 = navigationConfiguration.States[0];
			State state2 = navigationConfiguration.States[1];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Save);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "DuplicateDialogKey", state1, state2));
		}

		[TestMethod]
		public void NotInitialDialogTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/NotInitialDialog.nav");
			State state = navigationConfiguration.States[0];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Menu);
			Assert.AreEqual(1, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(0, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.WarningMessages[0], "StateDialogNotInitial", state));
		}

		[TestMethod]
		public void DuplicateStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DuplicateState.nav");
			State state1 = navigationConfiguration.States[0];
			State state2 = navigationConfiguration.States[1];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Open);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "DuplicateStateKey", state1, state2));
		}

		[TestMethod]
		public void DuplicateStateAcrossDialogTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DuplicateStateAcrossDialog.nav");
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Save);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(0, validator.ErrorMessages.Count);
		}

		[TestMethod]
		public void DuplicatedRoutedStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DuplicatedRoutedState.nav");
			State state = navigationConfiguration.States[2];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Menu);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(1, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(0, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.InformationalMessages[0], "StateRouteInvalid", state));
		}

		[TestMethod]
		public void FullStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/FullState.nav");
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Open);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(0, validator.InformationalMessages.Count);
			Assert.AreEqual(0, validator.FatalMessages.Count);
			Assert.AreEqual(0, validator.ErrorMessages.Count);
		}

		[TestMethod]
		public void StateCreationTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/BlankModel.nav");
			using (Transaction t = navigationConfiguration.Store.TransactionManager.BeginTransaction("test"))
			{
				State state = new State(navigationConfiguration.Store);
				state.Key = "State1";
				t.Commit();
				Assert.AreEqual("~/Page.aspx", state.Page);
				Assert.IsTrue(state.Initial);
				Assert.AreEqual("Route", state.Route);
			}
		}

		[TestMethod]
		public void CreateTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/CreateFirstToTransition.nav");
			using (Transaction t = navigationConfiguration.Store.TransactionManager.BeginTransaction("test"))
			{
				State from = navigationConfiguration.States[0];
				State to = navigationConfiguration.States[1];
				from.Successors.Add(to);
				t.Commit();
				Assert.AreEqual("B", to.Key);
			}
		}

		[TestMethod]
		public void CreateFirstToTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/CreateFirstToTransition.nav");
			using (Transaction t = navigationConfiguration.Store.TransactionManager.BeginTransaction("test"))
			{
				State from = navigationConfiguration.States[0];
				State to = navigationConfiguration.States[1];
				from.Successors.Add(to);
				t.Commit();
				Assert.IsFalse(to.Initial);
			}
		}

		[TestMethod]
		public void DeleteLastToTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DeleteLastToTransition.nav");
			using (Transaction t = navigationConfiguration.Store.TransactionManager.BeginTransaction("test"))
			{
				State from = navigationConfiguration.States[0];
				State to = navigationConfiguration.States[1];
				from.Successors.Remove(to);
				t.Commit();
				Assert.IsTrue(to.Initial);
			}
		}

		[TestMethod]
		public void DeleteStateWithOneToTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DeleteLastToTransition.nav");
			using (Transaction t = navigationConfiguration.Store.TransactionManager.BeginTransaction("test"))
			{
				State to = navigationConfiguration.States[1];
				navigationConfiguration.States.Remove(to);
				t.Commit();
				Assert.IsFalse(to.Initial);
			}
		}

		[TestMethod]
		public void DeleteOneToTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DeleteOneToTransition.nav");
			using (Transaction t = navigationConfiguration.Store.TransactionManager.BeginTransaction("test"))
			{
				State from = navigationConfiguration.States[0];
				State to = navigationConfiguration.States[1];
				from.Successors.Remove(to);
				t.Commit();
				Assert.IsFalse(to.Initial);
			}
		}
	}
}
