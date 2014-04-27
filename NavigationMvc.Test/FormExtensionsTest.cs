using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.IO;
using System.Text;
using System.Web.Mvc;

namespace Navigation.Mvc.Test
{
	[TestClass]
	public class FormExtensionsTest
	{
		private static HtmlHelper GetHtmlHelper(StringBuilder tagBuilder)
		{
			ViewContext context = new Mock<ViewContext>().Object;
			IViewDataContainer container = new Mock<IViewDataContainer>().Object;
			Mock.Get(context).Setup(c => c.Writer).Returns(new StringWriter(tagBuilder));
			return new HtmlHelper(context, container);
		}

		[TestMethod]
		public void NavigationFormTest()
		{
			StringBuilder tagBuilder = new StringBuilder();
			StateController.Navigate("d0");
			GetHtmlHelper(tagBuilder).BeginNavigationForm("t0");
			Assert.AreEqual("<form action=\"/r1\" method=\"post\">", tagBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormDataTest()
		{
			StringBuilder tagBuilder = new StringBuilder();
			StateController.Navigate("d0");
			GetHtmlHelper(tagBuilder).BeginNavigationForm("t0", new NavigationData { { "a", "1" } });
			Assert.AreEqual("<form action=\"/r1?a=1\" method=\"post\">", tagBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormMethodAttributeTest()
		{
			StringBuilder tagBuilder = new StringBuilder();
			GetHtmlHelper(tagBuilder).BeginNavigationForm("d0", new { method="get" });
			Assert.AreEqual("<form action=\"/\" method=\"get\">", tagBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormAttributesTest()
		{
			StringBuilder tagBuilder = new StringBuilder();
			GetHtmlHelper(tagBuilder).BeginNavigationForm("d0", new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/\" method=\"post\" onsubmit=\"validate\">", tagBuilder.ToString());
		}
	}
}
