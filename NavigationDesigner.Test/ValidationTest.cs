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
			using (Transaction t = store.TransactionManager.BeginTransaction())
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
			Assert.AreEqual(2, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StateKeyEmpty", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[1], "StatePageEmpty", state));
		}

		[TestMethod]
		public void BlankInitialStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/BlankInitialState.nav");
			State state = navigationConfiguration.States[0];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Save);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(4, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "PathAndRouteEmpty", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[1], "StateKeyEmpty", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[2], "StatePageEmpty", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[3], "DialogKeyEmpty", state));
		}

		[TestMethod]
		public void PathsFormatStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/PathsFormatState.nav");
			State state = navigationConfiguration.States[0];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Menu);
			Assert.AreEqual(0, validator.WarningMessages.Count);
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
			Assert.AreEqual(2, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StateResourceInvalid", state));
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[1], "DialogResourceInvalid", state));
		}

		[TestMethod]
		public void DefaultsStateTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/DefaultsState.nav");
			State state = navigationConfiguration.States[0];
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Menu);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "StateDefaultsInvalid", state));
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
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "DuplicateTransitionKey", transition1, transition2));
		}

		[TestMethod]
		public void BlankTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/BlankTransition.nav");
			Transition transition = Transition.GetLink(navigationConfiguration.States[0], navigationConfiguration.States[1]);
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Save);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "TransitionKeyEmpty", transition));
		}

		[TestMethod]
		public void NoBackToInitialTransitionTest()
		{
			NavigationDiagram navigationConfiguration = LoadModel("Diagram/NoBackToInitialTransition.nav");
			Transition transition = Transition.GetLink(navigationConfiguration.States[1], navigationConfiguration.States[0]);
			ValidationController validator = new ValidationController();
			validator.Validate(navigationConfiguration.Store, ValidationCategories.Save);
			Assert.AreEqual(0, validator.WarningMessages.Count);
			Assert.AreEqual(1, validator.ErrorMessages.Count);
			Assert.IsTrue(ValidateValidationMessages(validator.ErrorMessages[0], "TransitionWithoutBackToInitialState", transition));
		}
	}
}
