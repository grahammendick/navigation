#if NET40Plus
using System;

namespace Navigation
{
	/// <summary>
	/// Configures Web Api state information. A child of a <see cref="FluentDialog"/>
	/// element, it represents the endpoint of a navigation
	/// </summary>
	public class WebApiState : FluentState
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="WebApiState"/> class
		/// </summary>
		/// <param name="route">The route Url pattern</param>
		/// <param name="controller">The name of the controller</param>
		/// <param name="action">The name of the action</param>
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
#endif
