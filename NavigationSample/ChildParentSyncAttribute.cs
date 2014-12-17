using System.Web.Mvc;

namespace Navigation.Sample
{
	public class ChildParentSyncAttribute : FilterAttribute, IActionFilter
	{
		public void OnActionExecuting(ActionExecutingContext filterContext)
		{
			if (filterContext.IsChildAction)
			{
				var parentModelState = filterContext.ParentActionViewContext.ViewData.ModelState;
				var modelState = filterContext.Controller.ViewData.ModelState;
				foreach (var item in parentModelState)
				{
					if (!modelState.ContainsKey(item.Key))
						modelState.Add(item.Key, item.Value);
				}
			}
		}

		public void OnActionExecuted(ActionExecutedContext filterContext)
		{
		}
	}
}