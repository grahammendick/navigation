using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Web.Mvc;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class SorterExtensionsTest
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
		public void SorterDefaultDescendingTest()
		{
			StateController.Navigate("d7");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r0?sortExpression=a%20DESC\">link</a>", HtmlHelper.Sorter("link", "a").ToHtmlString());
		}

		[TestMethod]
		public void SorterAscendingTest()
		{
			StateController.Navigate("d7", new NavigationData { { "sortExpression", "a DESC" } });
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r0?sortExpression=a\">link</a>", HtmlHelper.Sorter("link", "a").ToHtmlString());
		}

		[TestMethod]
		public void SorterDescendingTest()
		{
			StateController.Navigate("d7", new NavigationData { { "sortExpression", "a" } });
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r0?sortExpression=a%20DESC\">link</a>", HtmlHelper.Sorter("link", "a").ToHtmlString());
		}

		[TestMethod]
		public void SorterTextEncodedTest()
		{
			StateController.Navigate("d7", new NavigationData { { "sortExpression", "a DESC" } });
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r0?sortExpression=a\">link&lt;</a>", HtmlHelper.Sorter("link<", "a").ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void SorterNullTextTest()
		{
			StateController.Navigate("d7");
			HtmlHelper.Sorter(null, "a");
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void SorterBlankTextTest()
		{
			StateController.Navigate("d7");
			HtmlHelper.Sorter("", "a");
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void SorterNullSortByTest()
		{
			StateController.Navigate("d7");
			HtmlHelper.Sorter("link", null);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void SorterBlankSortByTest()
		{
			StateController.Navigate("d7");
			HtmlHelper.Sorter("link", "");
		}

		[TestMethod]
		public void SorterSortExpressionTest()
		{
			StateController.Navigate("d7", new NavigationData { { "orderBy", "a DESC" } });
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r0?orderBy=a\">link</a>", HtmlHelper.Sorter("link", "a", "orderBy").ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void SorterNullSortExpressionTest()
		{
			StateController.Navigate("d7");
			HtmlHelper.Sorter("link", "a", null);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void SorterBlankSortExpressionTest()
		{
			StateController.Navigate("d7");
			HtmlHelper.Sorter("link", "a", "");
		}

		[TestMethod]
		public void SorterAttributesTest()
		{
			StateController.Navigate("d7", new NavigationData { { "sortExpression", "a DESC" } });
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r0?sortExpression=a\" title=\"details\">link</a>", HtmlHelper.Sorter("link", "a", 
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void SorterSortExpressionAndAttributesTest()
		{
			StateController.Navigate("d7", new NavigationData { { "orderBy", "a DESC" } });
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r0?orderBy=a\" title=\"details\">link</a>", HtmlHelper.Sorter("link", "a", "orderBy",
				new { title = "details" }).ToHtmlString());
		}
	}
}
