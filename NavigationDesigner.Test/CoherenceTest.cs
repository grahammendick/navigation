using Microsoft.VisualStudio.Modeling;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Navigation.Designer;

namespace NavigationDesigner.Test
{
	[TestClass]
	public class CoherenceTest
	{
		[TestMethod]
		public void InitialDialogCoherenceTest()
		{
			Store store = new Store(typeof(NavigationLanguageDomainModel));
			using (Transaction t = store.TransactionManager.BeginTransaction())
			{
				NavigationDiagram navigationConfiguration = NavigationLanguageSerializationHelper.Instance.LoadModel(store, "Diagram/InitialDialogCoherence.nav", null, null, null);
				State state = navigationConfiguration.States[0];
				state.Initial = false;
				t.Commit();
				Assert.AreEqual(string.Empty, state.DialogKey);
				Assert.AreEqual(string.Empty, state.DialogTitle);
				Assert.AreEqual(string.Empty, state.DialogResourceType);
				Assert.AreEqual(string.Empty, state.DialogResourceKey);
				Assert.AreEqual(string.Empty, state.Path);
				Assert.AreEqual(0, state.DialogOrder);
			}
		}

		[TestMethod]
		public void DialogInitialCoherenceTest()
		{
			Store store = new Store(typeof(NavigationLanguageDomainModel));
			using (Transaction t = store.TransactionManager.BeginTransaction())
			{
				NavigationDiagram navigationConfiguration = NavigationLanguageSerializationHelper.Instance.LoadModel(store, "Diagram/InitialDialogCoherence.nav", null, null, null);
				State state = navigationConfiguration.States[0];
				state.DialogKey = null;
				state.DialogTitle = string.Empty;
				state.DialogResourceType = null;
				state.DialogResourceKey = null;
				state.Path = null;
				state.DialogOrder = 0;
				t.Commit();
				Assert.IsFalse(state.Initial);
			}
		}
	}
}
