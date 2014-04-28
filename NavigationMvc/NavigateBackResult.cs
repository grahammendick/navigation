using System;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public class NavigateBackResult : ActionResult
	{
		public NavigateBackResult(int distance)
		{
			Distance = distance;
		}

		public int Distance
		{
			get;
			private set;
		}

		public override void ExecuteResult(ControllerContext context)
		{
			if (context == null)
			{
				throw new ArgumentNullException("context");
			}
			if (context.IsChildAction)
			{
				throw new InvalidOperationException();
			}
			context.Controller.TempData.Keep();
			StateController.NavigateBack(Distance, NavigationMode.ClientNoAbort);
		}
	}
}
