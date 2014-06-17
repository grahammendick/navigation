using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ValueProviders;

namespace Navigation.Test.WebApi
{
	[TestClass]
	public class NavigationDataValueProviderTest
	{
		[TestMethod]
		public void NavigationDataValueProviderFactoryTest()
		{
			NavigationDataValueWebApiProviderFactory factory = new NavigationDataValueWebApiProviderFactory();
			Assert.IsTrue(factory.GetValueProvider(null) is NavigationDataWebApiValueProvider);
		}

		[TestMethod]
		public void NavigationDataValueProviderFactoryRegisteredTest()
		{
			Assert.IsTrue(GlobalConfiguration.Configuration.Services.GetServices(typeof(ValueProviderFactory)).First() is NavigationDataValueWebApiProviderFactory);
		}

		[TestMethod]
		public void NavigationDataValueProviderValueTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataWebApiValueProvider valueProvider = new NavigationDataWebApiValueProvider();
			Assert.AreEqual(1, ((ValueProviderResult)valueProvider.GetValue("a")).RawValue);
			Assert.AreEqual("1", ((ValueProviderResult)valueProvider.GetValue("a")).AttemptedValue);
		}

		[TestMethod]
		public void NavigationDataValueProviderValueCaseInsensitiveTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataWebApiValueProvider valueProvider = new NavigationDataWebApiValueProvider();
			Assert.AreEqual(1, ((ValueProviderResult)valueProvider.GetValue("A")).RawValue);
			Assert.AreEqual("1", ((ValueProviderResult)valueProvider.GetValue("A")).AttemptedValue);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentNullException))]
		public void NavigationDataValueProviderNullKeyTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataWebApiValueProvider valueProvider = new NavigationDataWebApiValueProvider();
			valueProvider.GetValue(null);
		}

		[TestMethod]
		public void NavigationDataValueProviderNullValueTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", 1 } });
			NavigationDataWebApiValueProvider valueProvider = new NavigationDataWebApiValueProvider();
			Assert.IsNull(valueProvider.GetValue("b"));
		}
	}
}
