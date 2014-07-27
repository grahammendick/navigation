using System;

namespace Navigation
{
	public class WebApiState : FluentState
	{
		public WebApiState(string route, string controller, string action)
			: base(route)
		{
			if (string.IsNullOrEmpty(controller))
				throw new ArgumentException("controller");
			if (string.IsNullOrEmpty(action))
				throw new ArgumentException("action");
			AddAttribute("apiController", controller);
			AddAttribute("action", action);
		}
	}
}
