#if NET40Plus
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.IO;
using System.Text;
using System.Web.Mvc;

namespace Navigation.Test.Mvc
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
			StateController.Navigate("d7");
			GetHtmlHelper(formBuilder).BeginNavigationForm("t0");
			Assert.AreEqual("<form action=\"/r1\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormDataTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			GetHtmlHelper(formBuilder).BeginNavigationForm("t0", new NavigationData { { "a", "1" } });
			Assert.AreEqual("<form action=\"/r1?a=1\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormMethodAttributeTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			GetHtmlHelper(formBuilder).BeginNavigationForm("d7", null, new { method="get" });
			Assert.AreEqual("<form action=\"/r0\" method=\"get\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationFormAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			GetHtmlHelper(formBuilder).BeginNavigationForm("d7", null, new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/r0\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationBackFormTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "a", "1" } });
			StateController.Navigate("t0");
			GetHtmlHelper(formBuilder).BeginNavigationBackForm(1);
			Assert.AreEqual("<form action=\"/r1?a=1\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void NavigationBackFormAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			GetHtmlHelper(formBuilder).BeginNavigationBackForm(1, null, new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/r1\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "a", "1" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm();
			Assert.AreEqual("<form action=\"/r1\" data-navigation=\"refresh\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormDataTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" } });
			Assert.AreEqual("<form action=\"/r1?a=1\" data-navigation=\"refresh\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0");
			GetHtmlHelper(formBuilder).BeginRefreshForm(null, new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/r1\" data-navigation=\"refresh\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormDataAndAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" } }, false, null, new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/r0?a=1\" data-navigation=\"refresh\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormIncludeCurrentDataTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" } }, true);
			Assert.AreEqual("<form action=\"/r1?b=0&amp;a=1\" data-include-current=\"true\" data-navigation=\"refresh\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormIncludeCurrentDataNullToDataTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm(null, true);
			Assert.AreEqual("<form action=\"/r1?b=0\" data-include-current=\"true\" data-navigation=\"refresh\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormIncludeCurrentDataCurrentKeysTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" }, { "b", "" }, { "c", "" }, { "startRowIndex", 0 }, { "maximumRows", "" }, { "totalRowCount", 12 } }, true);
			Assert.AreEqual("<form action=\"/r1?a=1\" data-current-keys=\"b,c,startRowIndex,maximumRows\" data-include-current=\"true\" data-navigation=\"refresh\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormIncludeCurrentDataAndAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" } }, true, null, new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/r1?b=0&amp;a=1\" data-include-current=\"true\" data-navigation=\"refresh\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormCurrentDataKeysTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" } }, " b , startRowIndex");
			Assert.AreEqual("<form action=\"/r1?b=0&amp;a=1\" data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormCurrentDataKeysNullToDataTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm(null, " b , startRowIndex");
			Assert.AreEqual("<form action=\"/r1?b=0\" data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" method=\"post\">", formBuilder.ToString());
		}

		[TestMethod]
		public void RefreshFormCurrentDataKeysAndAttributesTest()
		{
			StringBuilder formBuilder = new StringBuilder();
			StateController.Navigate("d7");
			StateController.Navigate("t0", new NavigationData { { "b", "0" }, { "startRowIndex", 0 }, { "c", "2" } });
			GetHtmlHelper(formBuilder).BeginRefreshForm(new NavigationData { { "a", "1" } }, " b , startRowIndex", null, new { onsubmit = "validate" });
			Assert.AreEqual("<form action=\"/r1?b=0&amp;a=1\" data-current-keys=\"b,startRowIndex\" data-navigation=\"refresh\" method=\"post\" onsubmit=\"validate\">", formBuilder.ToString());
		}
	}
}
#endif
