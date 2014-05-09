using Microsoft.VisualStudio.TestTools.UnitTesting;
using Navigation.WebApi;

namespace NavigationWebApi.Test
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
	}
}
