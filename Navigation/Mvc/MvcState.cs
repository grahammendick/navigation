#if NET40Plus
using System;

namespace Navigation
{
	public class MvcState : FluentState
	{
		public MvcState(string route, string controller, string action)
			: this(route, controller, action, null)
		{
		}

		public MvcState(string route, string controller, string action, string area)
			: base(route)
		{
			if (string.IsNullOrEmpty(route))
				throw new ArgumentException("route");
			if (string.IsNullOrEmpty(controller))
				throw new ArgumentException("controller");
			if (string.IsNullOrEmpty(action))
				throw new ArgumentException("action");
			AddAttribute("controller", controller);
			AddAttribute("action", action);
			if (!string.IsNullOrEmpty(area))
				AddAttribute("area", area);
		}
	}
}
#endif
