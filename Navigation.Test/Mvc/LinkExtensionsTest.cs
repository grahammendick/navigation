#if NET40Plus
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Web.Mvc;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class LinkExtensionsTest
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
		public void NavigationLinkTest()
		{
			Assert.AreEqual("<a href=\"/r0\">link</a>", HtmlHelper.NavigationLink("link", "d7").ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationLinkNullTextTest()
		{
			HtmlHelper.NavigationLink(null, "d7");
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationLinkBlankTextTest()
		{
			HtmlHelper.NavigationLink("", "d7");
		}

		[TestMethod]
		public void NavigationLinkTextEncodedTest()
		{
			Assert.AreEqual("<a href=\"/r0\">link&lt;</a>", HtmlHelper.NavigationLink("link<", "d7").ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkDataTest()
		{
			StateController.Navigate("d7");
			Assert.AreEqual("<a href=\"/r1?a=1\">link</a>", HtmlHelper.NavigationLink("link", "t0", 
				new NavigationData { { "a", "1" } }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkAttributesTest()
		{
			Assert.AreEqual("<a href=\"/r0\" title=\"details\">link</a>", HtmlHelper.NavigationLink("link", "d7", 
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkDataAndAttributesTest()
		{
			Assert.AreEqual("<a href=\"/r0?a=1\" title=\"details\">link</a>", HtmlHelper.NavigationLink("link", "d7", 
				new NavigationData { { "a", "1" } }, new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationBackLinkTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a href=\"/r1\">link</a>", HtmlHelper.NavigationBackLink("link", 1).ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationBackLinkBlankTextTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			HtmlHelper.NavigationBackLink("", 1);
		}

		[TestMethod]
		public void NavigationBackLinkAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a href=\"/r1\" title=\"details\">link</a>", HtmlHelper.NavigationBackLink("link", 1,
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1\">link</a>", HtmlHelper.RefreshLink("link").ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void RefreshLinkBlankTetTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			HtmlHelper.RefreshLink(null);
		}

		[TestMethod]
		public void RefreshLinkDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1?a=1\">link</a>", HtmlHelper.RefreshLink("link",
				new NavigationData { { "a", "1" } }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1\" title=\"details\">link</a>", HtmlHelper.RefreshLink("link",
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkNavigationDataAttributeTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"noajax\" href=\"/r1\">link</a>", HtmlHelper.RefreshLink("link",
				new { data_navigation = "noajax" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkDataAndAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1?a=1\" title=\"details\">link</a>", HtmlHelper.RefreshLink("link",
				new NavigationData { { "a", "1" } }, false, new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkDataAndNavigationDataAttributeTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"noajax\" href=\"/r1?a=1\">link</a>", HtmlHelper.RefreshLink("link",
				new NavigationData { { "a", "1" } }, false, new { data_navigation = "noajax" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkIncludeCurrentDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" href=\"/r1?b=0&amp;a=1\">link</a>",
				HtmlHelper.RefreshLink("link", new NavigationData { { "a", "1" } }, true).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkIncludeCurrentDataNullToDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" href=\"/r1?b=0\">link</a>", 
				HtmlHelper.RefreshLink("link", null, true).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkIncludeCurrentDataCurrentKeysTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			Assert.AreEqual("<a data-current-keys=\"b,c,startRowIndex\" data-include-current=\"true\" data-navigation=\"refresh\" href=\"/r1?a=1\">link</a>",
				HtmlHelper.RefreshLink("link", new NavigationData { { "a", "1" }, { "b", "" }, { "c", "" }, { "startRowIndex", 0 } }, true).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkIncludeCurrentDataAndAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" href=\"/r1?b=0&amp;a=1\" title=\"details\">link</a>",
				HtmlHelper.RefreshLink("link", new NavigationData { { "a", "1" } }, true, new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkCurrentDataKeysTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			Assert.AreEqual("<a data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" href=\"/r1?b=0&amp;a=1\">link</a>",
				HtmlHelper.RefreshLink("link", new NavigationData { { "a", "1" } }, " b , startRowIndex").ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkCurrentDataKeysAndAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			Assert.AreEqual("<a data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" href=\"/r1?b=0&amp;a=1\" title=\"details\">link</a>",
				HtmlHelper.RefreshLink("link", new NavigationData { { "a", "1" } }, " b , startRowIndex", new { title = "details" }).ToHtmlString());
		}
	}
}
#endif
