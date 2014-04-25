using System;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public class NavigateResult : ActionResult
	{
		public NavigateResult(string action) : this(action, null)
		{
		}

		public NavigateResult(string action, NavigationData toData)
		{
			Action = action;
			ToData = toData;
		}

		public string Action
		{
			get;
			private set;
		}

		public NavigationData ToData
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
			StateController.Navigate(Action, ToData);
		}
	}
}
