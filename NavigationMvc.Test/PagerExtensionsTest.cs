using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Web.Mvc;

namespace Navigation.Mvc.Test
{
	[TestClass]
	public class PagerExtensionsTest
	{
		private static HtmlHelper HtmlHelper
		{
			get
			{
				ViewContext context = new Mock<ViewContext>().Object;
				IViewDataContainer container = new Mock<IViewDataContainer>().Object;
				return new HtmlHelper(context, container);
			}
		}

		[TestMethod]
		public void PagerOnePageTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 1;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li><li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}
	}
}
