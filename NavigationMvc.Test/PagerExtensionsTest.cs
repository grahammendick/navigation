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
		public void PagerEmptyTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 0;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li><li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerOnePageTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 1;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li><li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerOneFullPageTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 10;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li><li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerFirstPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li>" + 
				"<li><a href=\"/r1/10\">&gt;</a></li>" + 
				"<li><a href=\"/r1/10\">&gt;&gt;</a></li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerSecondPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul><li><a href=\"/r1\">&lt;&lt;</a></li>" + 
				"<li><a href=\"/r1\">&lt;</a></li>" + 
				"<li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerSecondFullPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 20;
			Assert.AreEqual("<ul><li><a href=\"/r1\">&lt;&lt;</a></li>" + 
				"<li><a href=\"/r1\">&lt;</a></li>" + 
				"<li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerSecondPageOfThreeTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 21;
			Assert.AreEqual("<ul><li><a href=\"/r1\">&lt;&lt;</a></li>" + 
				"<li><a href=\"/r1\">&lt;</a></li>" + 
				"<li><a href=\"/r1/20\">&gt;</a></li>" + 
				"<li><a href=\"/r1/20\">&gt;&gt;</a></li></ul>", HtmlHelper.Pager().ToHtmlString());
		}
	}
}
