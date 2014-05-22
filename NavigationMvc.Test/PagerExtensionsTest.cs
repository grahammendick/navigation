using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
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
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li>" + 
				"<li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerOnePageTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 1;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li>" + 
				"<li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerOneFullPageTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 10;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li>" + 
				"<li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerFirstPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li>" + 
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">&gt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">&gt;&gt;</a></li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerSecondPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1\">&lt;&lt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1\">&lt;</a></li>" + 
				"<li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerSecondFullPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 20;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1\">&lt;&lt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1\">&lt;</a></li>" + 
				"<li>&gt;</li><li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerSecondPageOfThreeTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 21;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1\">&lt;&lt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1\">&lt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/20\">&gt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/20\">&gt;&gt;</a></li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerFirstPageOfThreePageSizeNineTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 0;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 21;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/9/9\">&gt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/18/9\">&gt;&gt;</a></li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerSecondPageOfThreePageSizeNineTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 9;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 21;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/0/9\">&lt;&lt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/0/9\">&lt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/18/9\">&gt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/18/9\">&gt;&gt;</a></li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerFullThirdPageOfThreePageSizeNineTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 18;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 27;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/0/9\">&lt;&lt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/9/9\">&lt;</a></li>" +
				"<li>&gt;</li>" +
				"<li>&gt;&gt;</li></ul>", HtmlHelper.Pager().ToHtmlString());
		}

		[TestMethod]
		public void PagerLinkTextTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul><li>First</li><li>Prev</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">Next</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">Last</a></li></ul>", HtmlHelper.Pager("First", "Prev", "Next", "Last").ToHtmlString());
		}

		[TestMethod]
		public void PagerLinkTextEncodedTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul><li>First&gt;</li><li>&gt;Prev</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">&lt;Next</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">Last&lt;</a></li></ul>", HtmlHelper.Pager("First>", ">Prev", "<Next", "Last<").ToHtmlString());
		}

		[TestMethod]
		public void PagerKeyTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.start = 0;
			StateContext.Bag.size = 10;
			StateContext.Bag.total = 21;
			Assert.AreEqual("<ul><li>&lt;&lt;</li><li>&lt;</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=10&amp;size=10&amp;total=21\">&gt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=20&amp;size=10&amp;total=21\">&gt;&gt;</a></li></ul>",
				HtmlHelper.Pager("start", "size", "total").ToHtmlString());
		}

		[TestMethod]
		public void PagerLinkTextKeyTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.start = 0;
			StateContext.Bag.size = 10;
			StateContext.Bag.total = 21;
			Assert.AreEqual("<ul><li>First</li><li>Prev</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=10&amp;size=10&amp;total=21\">Next</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=20&amp;size=10&amp;total=21\">Last</a></li></ul>",
				HtmlHelper.Pager("First", "Prev", "Next", "Last", "start", "size", "total").ToHtmlString());
		}

		[TestMethod]
		public void PagerAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul title=\"details\"><li>&lt;&lt;</li><li>&lt;</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">&gt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">&gt;&gt;</a></li></ul>", HtmlHelper.Pager(new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void PagerLinkTextAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul title=\"details\"><li>First</li><li>Prev</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">Next</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">Last</a></li></ul>", 
				HtmlHelper.Pager("First", "Prev", "Next", "Last", new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void PagerKeyAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.start = 0;
			StateContext.Bag.size = 10;
			StateContext.Bag.total = 21;
			Assert.AreEqual("<ul title=\"details\"><li>&lt;&lt;</li><li>&lt;</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=10&amp;size=10&amp;total=21\">&gt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=20&amp;size=10&amp;total=21\">&gt;&gt;</a></li></ul>",
				HtmlHelper.Pager("start", "size", "total", new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void PagerLinkTextKeyAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.start = 0;
			StateContext.Bag.size = 10;
			StateContext.Bag.total = 21;
			Assert.AreEqual("<ul title=\"details\"><li>First</li><li>Prev</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=10&amp;size=10&amp;total=21\">Next</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=20&amp;size=10&amp;total=21\">Last</a></li></ul>",
				HtmlHelper.Pager("First", "Prev", "Next", "Last", "start", "size", "total", new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericEmptyTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 0;
			Assert.AreEqual("", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericOnePageTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 1;
			Assert.AreEqual("<ul><li>1</li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericOneFullPageTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 10;
			Assert.AreEqual("<ul><li>1</li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericFirstPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul><li>1</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/10\">2</a></li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericSecondPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 11;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1\">1</a></li>" +
				"<li>2</li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericSecondFullPageOfTwoTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 20;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1\">1</a></li>" +
				"<li>2</li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericSecondPageOfThreeTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 10;
			StateContext.Bag.totalRowCount = 21;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1\">1</a></li>" +
				"<li>2</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/20\">3</a></li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerFifthPageOfSixPageSizeNineTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 36;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 49;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/0/9\">1</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/9/9\">2</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/18/9\">3</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/27/9\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/45/9\">...</a></li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerFullFifthPageOfFivePageSizeNineTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 36;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 45;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/0/9\">1</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/9/9\">2</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/18/9\">3</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/27/9\">4</a></li>" +
				"<li>5</li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericSeventhPageOfElevenPageSizeNineTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 54;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 97;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/36/9\">...</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/45/9\">6</a></li>" +
				"<li>7</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/63/9\">8</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/72/9\">9</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/81/9\">10</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/90/9\">...</a></li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericFullSeventhPageOfSevenPageSizeNineTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 54;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 63;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/36/9\">...</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/45/9\">6</a></li>" +
				"<li>7</li></ul>", HtmlHelper.Pager(5).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericThreeFullFifthPageOfSevenPageSizeNineTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 36;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 63;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/18/9\">...</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/27/9\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/45/9\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/54/9\">...</a></li></ul>", HtmlHelper.Pager(3).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericLinkTextTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 36;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 63;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/18/9\">Prev</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/27/9\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/45/9\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/54/9\">Next</a></li></ul>", HtmlHelper.Pager(3, "Prev", "Next").ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericLinkTextEncodedTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 36;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 63;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1/18/9\">Prev&lt;</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/27/9\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/45/9\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/54/9\">Next&lt;</a></li></ul>", HtmlHelper.Pager(3, "Prev<", "Next<").ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericKeyTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.start = 36;
			StateContext.Bag.size = 9;
			StateContext.Bag.total = 63;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1?start=18&amp;size=9&amp;total=63\">...</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=27&amp;size=9&amp;total=63\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=45&amp;size=9&amp;total=63\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=54&amp;size=9&amp;total=63\">...</a></li></ul>", HtmlHelper.Pager(3, "start", "size", "total").ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericLinkTextKeyTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.start = 36;
			StateContext.Bag.size = 9;
			StateContext.Bag.total = 63;
			Assert.AreEqual("<ul><li><a data-navigation=\"refresh\" href=\"/r1?start=18&amp;size=9&amp;total=63\">Prev</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=27&amp;size=9&amp;total=63\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=45&amp;size=9&amp;total=63\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=54&amp;size=9&amp;total=63\">Next</a></li></ul>", HtmlHelper.Pager(3, "Prev", "Next", "start", "size", "total").ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 36;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 63;
			Assert.AreEqual("<ul title=\"details\"><li><a data-navigation=\"refresh\" href=\"/r1/18/9\">...</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/27/9\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/45/9\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/54/9\">...</a></li></ul>", HtmlHelper.Pager(3, new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericLinkTextAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.startRowIndex = 36;
			StateContext.Bag.maximumRows = 9;
			StateContext.Bag.totalRowCount = 63;
			Assert.AreEqual("<ul title=\"details\"><li><a data-navigation=\"refresh\" href=\"/r1/18/9\">Prev</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/27/9\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/45/9\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1/54/9\">Next</a></li></ul>", HtmlHelper.Pager(3, "Prev", "Next", new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericKeyAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.start = 36;
			StateContext.Bag.size = 9;
			StateContext.Bag.total = 63;
			Assert.AreEqual("<ul title=\"details\"><li><a data-navigation=\"refresh\" href=\"/r1?start=18&amp;size=9&amp;total=63\">...</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=27&amp;size=9&amp;total=63\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=45&amp;size=9&amp;total=63\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=54&amp;size=9&amp;total=63\">...</a></li></ul>",
				HtmlHelper.Pager(3, "start", "size", "total", new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void PagerNumericLinkTextKeyAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.start = 36;
			StateContext.Bag.size = 9;
			StateContext.Bag.total = 63;
			Assert.AreEqual("<ul title=\"details\"><li><a data-navigation=\"refresh\" href=\"/r1?start=18&amp;size=9&amp;total=63\">Prev</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=27&amp;size=9&amp;total=63\">4</a></li>" +
				"<li>5</li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=45&amp;size=9&amp;total=63\">6</a></li>" +
				"<li><a data-navigation=\"refresh\" href=\"/r1?start=54&amp;size=9&amp;total=63\">Next</a></li></ul>",
				HtmlHelper.Pager(3, "Prev", "Next", "start", "size", "total", new { title = "details" }).ToHtmlString());
		}
	}
}
