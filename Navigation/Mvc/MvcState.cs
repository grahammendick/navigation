#if NET40Plus
using System;

namespace Navigation
{
	/// <summary>
	/// Configures Mvc <see cref="State"/> information. A child of a <see cref="FluentDialog"/> element
	/// </summary>
	public class MvcState : FluentState
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="MvcState"/> class
		/// </summary>
		/// <param name="route">The route Url pattern</param>
		/// <param name="controller">The name of the controller</param>
		/// <param name="action">The name of the action</param>
		public MvcState(string route, string controller, string action)
			: this(route, controller, action, null)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="MvcState"/> class
		/// </summary>
		/// <param name="route">The route Url pattern</param>
		/// <param name="controller">The name of the controller</param>
		/// <param name="action">The name of the action</param>
		/// <param name="area">The name of the area</param>
		public MvcState(string route, string controller, string action, string area)
			: base(route)
		{
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
