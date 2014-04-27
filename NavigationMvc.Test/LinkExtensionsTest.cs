using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Mvc;
using Moq;

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
		public void NavigationLinkBlankTextTest()
		{
			Assert.AreEqual("<a href=\"/\"></a>", HtmlHelper.NavigationLink(null, "d0").ToHtmlString());
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
	}
}
