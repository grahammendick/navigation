using Microsoft.VisualStudio.Modeling;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Navigation.Designer;

namespace NavigationDesigner.Test
{
	[TestClass]
	public class CoherenceTest
	{
		[TestMethod]
		public void DialogInitialCoherenceTest()
		{
			Store store = new Store(typeof(NavigationLanguageDomainModel));
			using (Transaction t = store.TransactionManager.BeginTransaction())
			{
				NavigationDiagram navigationConfiguration = NavigationLanguageSerializationHelper.Instance.LoadModel(store, "Diagram/InitialDialogCoherence.nav", null, null, null);
				State state = navigationConfiguration.States[0];
				state.Initial = true;
				t.Commit();
				Assert.AreEqual("A", state.DialogKey);
				Assert.AreEqual("~/A.aspx", state.Path);
			}
		}
	}
}
