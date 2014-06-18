#if NET40Plus
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Mvc;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class NavigationDataValueProviderTest
	{
		[TestMethod]
		public void NavigationDataValueProviderFactoryTest()
		{
			NavigationDataMvcValueProviderFactory factory = new NavigationDataMvcValueProviderFactory();
			Assert.IsTrue(factory.GetValueProvider(new ControllerContext()) is NavigationDataMvcValueProvider);
		}

		[TestMethod]
		public void NavigationDataValueProviderFactoryRegisteredTest()
		{
			Assert.IsTrue(ValueProviderFactories.Factories[3] is NavigationDataMvcValueProviderFactory);
		}

		[TestMethod]
		public void NavigationDataValueProviderValueTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataMvcValueProvider valueProvider = new NavigationDataMvcValueProvider();
			Assert.AreEqual(1, ((ValueProviderResult) valueProvider.GetValue("a")).RawValue);
		}
	}
}
#endif
