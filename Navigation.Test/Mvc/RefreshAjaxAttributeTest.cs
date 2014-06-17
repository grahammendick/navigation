using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Web.Mvc;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class RefreshAjaxAttributeTest
	{
		[TestMethod]
		public void RefreshAjaxAttributeRegisteredTest()
		{
			Assert.IsTrue(GlobalFilters.Filters.First().Instance is RefreshAjaxAttribute);
		}
	}
}
