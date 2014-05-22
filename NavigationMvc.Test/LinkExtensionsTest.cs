using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Web.Mvc;

namespace Navigation.Mvc.Test
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
			Assert.AreEqual("<a href=\"/\">link</a>", HtmlHelper.NavigationLink("link", "d0").ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationLinkNullTextTest()
		{
			HtmlHelper.NavigationLink(null, "d0");
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationLinkBlankTextTest()
		{
			HtmlHelper.NavigationLink("", "d0");
		}

		[TestMethod]
		public void NavigationLinkTextEncodedTest()
		{
			Assert.AreEqual("<a href=\"/\">link&lt;</a>", HtmlHelper.NavigationLink("link<", "d0").ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkDataTest()
		{
			StateController.Navigate("d0");
			Assert.AreEqual("<a href=\"/r1?a=1\">link</a>", HtmlHelper.NavigationLink("link", "t0", 
				new NavigationData { { "a", "1" } }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkAttributesTest()
		{
			Assert.AreEqual("<a href=\"/\" title=\"details\">link</a>", HtmlHelper.NavigationLink("link", "d0", 
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationLinkDataAndAttributesTest()
		{
			Assert.AreEqual("<a href=\"/?a=1\" title=\"details\">link</a>", HtmlHelper.NavigationLink("link", "d0", 
				new NavigationData { { "a", "1" } }, new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void NavigationBackLinkTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a href=\"/r1\">link</a>", HtmlHelper.NavigationBackLink("link", 1).ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigationBackLinkBlankTextTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			HtmlHelper.NavigationBackLink("", 1);
		}

		[TestMethod]
		public void NavigationBackLinkAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a href=\"/r1\" title=\"details\">link</a>", HtmlHelper.NavigationBackLink("link", 1,
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1\">link</a>", HtmlHelper.RefreshLink("link").ToHtmlString());
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void RefreshLinkBlankTetTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			HtmlHelper.RefreshLink(null);
		}

		[TestMethod]
		public void RefreshLinkDataTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1?a=1\">link</a>", HtmlHelper.RefreshLink("link",
				new NavigationData { { "a", "1" } }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1\" title=\"details\">link</a>", HtmlHelper.RefreshLink("link",
				new { title = "details" }).ToHtmlString());
		}

		[TestMethod]
		public void RefreshLinkDataAndAttributesTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			Assert.AreEqual("<a data-navigation=\"refresh\" href=\"/r1?a=1\" title=\"details\">link</a>", HtmlHelper.RefreshLink("link",
				new NavigationData { { "a", "1" } }, new { title = "details" }).ToHtmlString());
		}
	}
}
