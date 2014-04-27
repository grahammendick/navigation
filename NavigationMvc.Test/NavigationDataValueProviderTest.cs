using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Mvc;

namespace Navigation.Mvc.Test
{
	[TestClass]
	public class NavigationDataValueProviderTest
	{
		[TestMethod]
		public void NavigationDataValueProviderFactoryTest()
		{
			NavigationDataValueProviderFactory factory = new NavigationDataValueProviderFactory();
			Assert.IsTrue(factory.GetValueProvider(new ControllerContext()) is NavigationDataValueProvider);
		}

		[TestMethod]
		public void NavigationDataValueProviderFactoryRegisteredTest()
		{
			Assert.IsTrue(ValueProviderFactories.Factories[3] is NavigationDataValueProviderFactory);
		}

		[TestMethod]
		public void NavigationDataValueProviderValueTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataValueProvider valueProvider = new NavigationDataValueProvider();
			Assert.AreEqual(1, ((ValueProviderResult) valueProvider.GetValue("a")).RawValue);
		}
	}
}
