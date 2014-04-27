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
		private static HtmlHelper GetHtmlHelper(StringBuilder formBuilder)
		{
			ViewContext context = new Mock<ViewContext>().Object;
			IViewDataContainer container = new Mock<IViewDataContainer>().Object;
			Mock.Get(context).Setup(c => c.Writer).Returns(new StringWriter(formBuilder));
			return new HtmlHelper(context, container);
		}

		[TestMethod]
		public void NavigationFormTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d0");
			GetHtmlHelper(formBuilder).BeginNavigationForm("t0");
			Assert.AreEqual("<form action=\"/r1\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormDataTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d0");
			GetHtmlHelper(formBuilder).BeginNavigationForm("t0", new NavigationData { { "a", "1" } });
			Assert.AreEqual("<form action=\"/r1?a=1\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormMethodAttributeTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			GetHtmlHelper(formBuilder).BeginNavigationForm("d0", new { method="get" });
			Assert.AreEqual("<form action=\"/\" method=\"get\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			GetHtmlHelper(formBuilder).BeginNavigationForm("d0", new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationBackFormTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", "1" } });
			StateController.Navigate("t0");
			GetHtmlHelper(formBuilder).BeginNavigationBackForm(1);
			Assert.AreEqual("<form action=\"/r1?a=1\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationBackFormAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			GetHtmlHelper(formBuilder).BeginNavigationBackForm(1, new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/r1\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d0");
			StateController.Navigate("t0", new NavigationData { { "a", "1" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm();
			Assert.AreEqual("<form action=\"/r1\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormDataTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" } });
			Assert.AreEqual("<form action=\"/r1?a=1\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			GetHtmlHelper(formBuilder).BeginRefreshForm(new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/r1\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormDataAndAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d0");
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" } }, new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/?a=1\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}
	}
}
