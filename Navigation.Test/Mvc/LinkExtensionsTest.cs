#if NET40Plus
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.IO;
using System.Text;
using System.Web.Mvc;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class LinkExtensionsTest
	{
		private static HtmlHelper GetHtmlHelper(StringBuilder linkBuilder)
		{
			ViewContext context = new Mock<ViewContext>().Object;
			IViewDataContainer container = new Mock<IViewDataContainer>().Object;
			if (linkBuilder != null)
				Mock.Get(context).Setup(c => c.Writer).Returns(new StringWriter(linkBuilder));
			return new HtmlHelper(context, container);
		}

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
			Assert.AreEqual("<a href=\"/r0\">link</a>", GetHtmlHelper(null).NavigationLink("link", "d7").ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationLinkNullTextTest()
		{
			GetHtmlHelper(null).NavigationLink(null, "d7");
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationLinkBlankTextTest()
		{
			GetHtmlHelper(null).NavigationLink("", "d7");
		}

		[TestMethod]
		public void NavigationLinkTextEncodedTest()
		{
			Assert.AreEqual("<a href=\"/r0\">link&lt;</a>", GetHtmlHelper(null).NavigationLink("link<", "d7").ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkDataTest()
		{
			StateController.Navigate("d7");
			Assert.AreEqual("<a href=\"/r1?a=1\">link</a>", GetHtmlHelper(null).NavigationLink("link", "t0", 
				new NavigationData { { "a", "1" } }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkAttributesTest()
		{
			Assert.AreEqual("<a href=\"/r0\" title=\"details\">link</a>", GetHtmlHelper(null).NavigationLink("link", "d7", 
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkDataAndAttributesTest()
		{
			Assert.AreEqual("<a href=\"/r0?a=1\" title=\"details\">link</a>", GetHtmlHelper(null).NavigationLink("link", "d7", 
				new NavigationData { { "a", "1" } }, new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationBackLinkTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a href=\"/r1\">link</a>", GetHtmlHelper(null).NavigationBackLink("link", 1).ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationBackLinkBlankTextTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			GetHtmlHelper(null).NavigationBackLink("", 1);
		}

		[TestMethod]
		public void NavigationBackLinkAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a href=\"/r1\" title=\"details\">link</a>", GetHtmlHelper(null).NavigationBackLink("link", 1,
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1\">link</a>", GetHtmlHelper(null).RefreshLink("link").ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void RefreshLinkBlankTextTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			GetHtmlHelper(null).RefreshLink(null);
		}

		[TestMethod]
		public void RefreshLinkDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?a=1\">link</a>", GetHtmlHelper(null).RefreshLink("link",
				new NavigationData { { "a", "1" } }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1\" title=\"details\">link</a>", GetHtmlHelper(null).RefreshLink("link",
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkNavigationDataAttributeTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"noajax\" href=\"/r1\">link</a>", GetHtmlHelper(null).RefreshLink("link",
				new { data_navigation = "noajax" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkDataAndAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?a=1\" title=\"details\">link</a>", GetHtmlHelper(null).RefreshLink("link",
				new NavigationData { { "a", "1" } }, false, new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkDataAndNavigationDataAttributeTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"noajax\" data-to-keys=\"a\" href=\"/r1?a=1\">link</a>", GetHtmlHelper(null).RefreshLink("link",
				new NavigationData { { "a", "1" } }, false, new { data_navigation = "noajax" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkIncludeCurrentDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?b=0&amp;a=1\">link</a>",
				GetHtmlHelper(null).RefreshLink("link", new NavigationData { { "a", "1" } }, true).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkIncludeCurrentDataNullToDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" href=\"/r1?b=0\">link</a>", 
				GetHtmlHelper(null).RefreshLink("link", null, true).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkIncludeCurrentDataCurrentKeysTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" data-to-keys=\"a,b,c,startRowIndex,maximumRows,totalRowCount\" href=\"/r1?a=1\">link</a>",
				GetHtmlHelper(null).RefreshLink("link", new NavigationData { { "a", "1" }, { "b", "" }, { "c", "" }, { "startRowIndex", 0 }, { "maximumRows", "" }, { "totalRowCount", 12 } }, true).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkIncludeCurrentDataAndAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?b=0&amp;a=1\" title=\"details\">link</a>",
				GetHtmlHelper(null).RefreshLink("link", new NavigationData { { "a", "1" } }, true, new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkCurrentDataKeysTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "startRowIndex", 0 }, { "c", "2" } });
			Assert.AreEqual("<a data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?a=1\">link</a>",
				GetHtmlHelper(null).RefreshLink("link", new NavigationData { { "a", "1" } }, " b , startRowIndex").ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkCurrentDataKeysNullToDataTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			Assert.AreEqual("<a data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" href=\"/r1?b=0\">link</a>",
				GetHtmlHelper(null).RefreshLink("link", null, " b , startRowIndex").ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkCurrentDataKeysAndAttributesTest()
		{
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			Assert.AreEqual("<a data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?b=0&amp;a=1\" title=\"details\">link</a>",
				GetHtmlHelper(null).RefreshLink("link", new NavigationData { { "a", "1" } }, " b , startRowIndex", new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void BeginRefreshLinkTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			using (GetHtmlHelper(null).BeginRefreshLink(new StringWriter(linkBuilder))) { };
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkDataTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			using (GetHtmlHelper(null).BeginRefreshLink(new NavigationData { { "a", "1" } }, false, new StringWriter(linkBuilder))) { };
			Assert.AreEqual("<a data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?a=1\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkAttributesTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			using (GetHtmlHelper(null).BeginRefreshLink(new StringWriter(linkBuilder), new { title = "details" })) { };
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1\" title=\"details\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkNavigationDataAttributeTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			using (GetHtmlHelper(null).BeginRefreshLink(new StringWriter(linkBuilder), new { data_navigation = "noajax" })) { };
			Assert.AreEqual("<a data-navigation=\"noajax\" href=\"/r1\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkDataAndAttributesTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			using (GetHtmlHelper(null).BeginRefreshLink(new NavigationData { { "a", "1" } }, false, new StringWriter(linkBuilder), new { title = "details" })) { };
			Assert.AreEqual("<a data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?a=1\" title=\"details\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkDataAndNavigationDataAttributeTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			using (GetHtmlHelper(null).BeginRefreshLink(new NavigationData { { "a", "1" } }, false, new StringWriter(linkBuilder), new { data_navigation = "noajax" })) { };
			Assert.AreEqual("<a data-navigation=\"noajax\" data-to-keys=\"a\" href=\"/r1?a=1\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkIncludeCurrentDataTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			using (GetHtmlHelper(null).BeginRefreshLink(new NavigationData { { "a", "1" } }, true, new StringWriter(linkBuilder))) { };
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?b=0&amp;a=1\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkIncludeCurrentDataNullToDataTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			using (GetHtmlHelper(null).BeginRefreshLink(null, true, new StringWriter(linkBuilder))) { };
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" href=\"/r1?b=0\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkIncludeCurrentDataCurrentKeysTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			using (GetHtmlHelper(null).BeginRefreshLink(new NavigationData { { "a", "1" }, { "b", "" }, { "c", "" }, { "startRowIndex", 0 }, { "maximumRows", "" }, { "totalRowCount", 12 } }, true, new StringWriter(linkBuilder))) { };
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" data-to-keys=\"a,b,c,startRowIndex,maximumRows,totalRowCount\" href=\"/r1?a=1\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkIncludeCurrentDataAndAttributesTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			using (GetHtmlHelper(null).BeginRefreshLink(new NavigationData { { "a", "1" } }, true, new StringWriter(linkBuilder), new { title = "details" })) { };
			Assert.AreEqual("<a data-include-current=\"true\" data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?b=0&amp;a=1\" title=\"details\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkCurrentDataKeysTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "startRowIndex", 0 }, { "c", "2" } });
			using (GetHtmlHelper(null).BeginRefreshLink(new NavigationData { { "a", "1" } }, " b , startRowIndex", new StringWriter(linkBuilder))) { };
			Assert.AreEqual("<a data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?a=1\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkCurrentDataKeysNullToDataTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			using (GetHtmlHelper(null).BeginRefreshLink(null, " b , startRowIndex", new StringWriter(linkBuilder))) { };
			Assert.AreEqual("<a data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" href=\"/r1?b=0\"></a>", linkBuilder.ToString());
		}

		[TestMethod]
		public void BeginRefreshLinkCurrentDataKeysAndAttributesTest()
		{
			StringBuilder linkBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			using (GetHtmlHelper(null).BeginRefreshLink(new NavigationData { { "a", "1" } }, " b , startRowIndex", new StringWriter(linkBuilder), new { title = "details" })) { };
			Assert.AreEqual("<a data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" data-to-keys=\"a\" href=\"/r1?b=0&amp;a=1\" title=\"details\"></a>", linkBuilder.ToString());
		}
	}
}
#endif
