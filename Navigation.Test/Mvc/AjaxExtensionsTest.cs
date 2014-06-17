using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections;
using System.Web.Mvc;
using System.Web.WebPages;

namespace Navigation.Test.Mvc
{
	[TestClass]
	public class AjaxExtensionsTest
	{
		private static AjaxHelper AjaxHelper
		{
			get
			{
				ViewContext context = new Mock<ViewContext> { DefaultValue = DefaultValue.Mock }.Object;
				Mock.Get(context.HttpContext).Setup(c => c.Items).Returns(new Hashtable());
				IViewDataContainer container = new Mock<IViewDataContainer>().Object;
				return new AjaxHelper(context, container);
			}
		}

		[TestMethod]
		public void RefreshPanelTest()
		{
			Assert.AreEqual("<span id=\"panel\"></span>", AjaxHelper.RefreshPanel("panel", "", 
				(obj) => new HelperResult((writer) => { })).ToHtmlString());
		}

		[TestMethod]
		public void RefreshPanelContentTest()
		{
			Assert.AreEqual("<span id=\"panel\"><div></div></span>", AjaxHelper.RefreshPanel("panel", "", 
				(obj) => new HelperResult((writer) => {
					writer.Write("<div></div>");
				})).ToHtmlString());
		}
	}
}
