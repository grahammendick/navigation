using System;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	/// <summary>
	/// Controls the processing of application actions by navigating via a call to
	/// <see cref="StateController.Navigate(string, NavigationData)"/>
	/// </summary>
	public class NavigateResult : ActionResult
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="NavigateResult"/> class
		/// </summary>
		/// <param name="action">The key of a child <see cref="Transition"/> or the key of 
		/// a <see cref="Dialog"/></param>
		public NavigateResult(string action) : this(action, null)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="NavigateResult"/> class
		/// </summary>
		/// <param name="action">The key of a child <see cref="Transition"/> or the key of 
		/// a <see cref="Dialog"/></param>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the next
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		public NavigateResult(string action, NavigationData toData)
		{
			Action = action;
			ToData = toData;
		}

		/// <summary>
		/// The key of a child <see cref="Transition"/> or the key of a <see cref="Dialog"/>
		/// </summary>
		public string Action
		{
			get;
			private set;
		}

		/// <summary>
		/// The <see cref="NavigationData"/> to be passed to the next <see cref="State"/> and
		/// stored in the <see cref="StateContext"/>
		/// </summary>
		public NavigationData ToData
		{
			get;
			private set;
		}

		/// <summary>
		/// Navigates via a call to <see cref="StateController.Navigate(string, NavigationData)"/>
		/// </summary>
		/// <param name="context">The context within which the result is executed</param>
		/// <exception cref="System.ArgumentNullException"><see cref="Action"/> is null or
		/// <paramref name="context"/> is null</exception>
		/// <exception cref="System.ArgumentException"><see cref="Action"/> does not match the key
		/// of a child <see cref="Transition"/> or the key of a <see cref="Dialog"/>; or there is 
		/// <see cref="NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public override void ExecuteResult(ControllerContext context)
		{
			if (context == null)
			{
				throw new ArgumentNullException("context");
			}
			context.Controller.TempData.Keep();
			StateController.Navigate(Action, ToData);
		}
	}
}
