using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Web.Mvc;

namespace Navigation.Mvc.Test
{
	[TestClass]
	public class ActionResultTest
	{
		private static ControllerContext ControllerContext
		{
			get
			{
				return new Mock<ControllerContext> { DefaultValue = DefaultValue.Mock }.Object;
			}
		}

		[AssemblyInitialize]
		public static void AddStateRoutes(TestContext context)
		{
			RouteConfig.AddStateRoutes();
		}

		[TestMethod]
		public void NavigateResultDialogTest()
		{
			NavigateResult result = new NavigateResult("d0");
			result.ExecuteResult(ControllerContext);
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[0], StateContext.State);
		}
	}
}
