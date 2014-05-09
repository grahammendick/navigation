using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ValueProviders;

namespace Navigation.WebApi.Test
{
	[TestClass]
	public class NavigationDataValueProviderTest
	{
		[TestMethod]
		public void NavigationDataValueProviderFactoryTest()
		{
			NavigationDataValueProviderFactory factory = new NavigationDataValueProviderFactory();
			Assert.IsTrue(factory.GetValueProvider(null) is NavigationDataValueProvider);
		}

		[TestMethod]
		public void NavigationDataValueProviderFactoryRegisteredTest()
		{
			Assert.IsTrue(GlobalConfiguration.Configuration.Services.GetServices(typeof(ValueProviderFactory)).ToList()[0] is NavigationDataValueProviderFactory);
		}

		[TestMethod]
		public void NavigationDataValueProviderValueTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataValueProvider valueProvider = new NavigationDataValueProvider();
			Assert.AreEqual(1, ((ValueProviderResult)valueProvider.GetValue("a")).RawValue);
			Assert.AreEqual("1", ((ValueProviderResult)valueProvider.GetValue("a")).AttemptedValue);
		}

		[TestMethod]
		public void NavigationDataValueProviderValueCaseInsensitiveTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataValueProvider valueProvider = new NavigationDataValueProvider();
			Assert.AreEqual(1, ((ValueProviderResult)valueProvider.GetValue("A")).RawValue);
			Assert.AreEqual("1", ((ValueProviderResult)valueProvider.GetValue("A")).AttemptedValue);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void NavigationDataValueProviderNullKeyTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataValueProvider valueProvider = new NavigationDataValueProvider();
			valueProvider.GetValue(null);
		}

		[TestMethod]
		public void NavigationDataValueProviderNullValueTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataValueProvider valueProvider = new NavigationDataValueProvider();
			Assert.IsNull(valueProvider.GetValue("b"));
		}
	}
}
