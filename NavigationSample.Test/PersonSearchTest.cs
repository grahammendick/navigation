using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace Navigation.Sample.Test
{
	[TestClass]
	public class PersonSearchTest
	{
		[TestMethod]
		public void SearchTest()
		{
			var actual = new PersonSearch().Search(null, null, null, 0, 10);
			Assert.AreEqual(10, actual.ToList().Count);
			Assert.AreEqual(12, StateContext.Data["totalRowCount"]);
		}
	}
}
