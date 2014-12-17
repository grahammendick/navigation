using System;
using System.Reflection;
using System.Web.Mvc;

namespace Navigation.Sample
{
	public class ActionSelectorAttribute : ActionNameSelectorAttribute
	{
		public override bool IsValidName(ControllerContext controllerContext, string actionName, MethodInfo methodInfo)
		{
			if (!controllerContext.IsChildAction)
				actionName = controllerContext.Controller.ValueProvider.GetValue("action").AttemptedValue;
			return StringComparer.OrdinalIgnoreCase.Compare(actionName, methodInfo.Name) == 0;
		}
	}
}