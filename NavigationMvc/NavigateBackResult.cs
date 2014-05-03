using System;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	/// <summary>
	/// Controls the processing of application actions by navigating via a call to
	/// <see cref="StateController.NavigateBack(int)"/>
	/// </summary>
	public class NavigateBackResult : ActionResult
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="NavigateBackResult"/> class
		/// </summary>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps
		/// to go back</param>
		public NavigateBackResult(int distance)
		{
			Distance = distance;
		}

		/// <summary>
		/// Starting at 1, the number of <see cref="Crumb"/> steps to go back
		/// </summary>
		public int Distance
		{
			get;
			private set;
		}

		/// <summary>
		/// Navigates via a call to <see cref="StateController.NavigateBack(int)"/>
		/// </summary>
		/// <param name="context">The context within which the result is executed</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="context"/> is null</exception>
		/// <exception cref="System.ArgumentException"><see cref="StateController.CanNavigateBack"/>
		/// returns false for this <see cref="Distance"/></exception>
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been
		/// supplied a value</exception>
		public override void ExecuteResult(ControllerContext context)
		{
			if (context == null)
			{
				throw new ArgumentNullException("context");
			}
			context.Controller.TempData.Keep();
			StateController.NavigateBack(Distance);
		}
	}
}
