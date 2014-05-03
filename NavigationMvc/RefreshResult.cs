using System;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	/// <summary>
	/// Controls the processing of application actions by navigating via a call to
	/// <see cref="StateController.Refresh(NavigationData)"/>
	/// </summary>
	public class RefreshResult : ActionResult
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="RefreshResult"/> class
		/// </summary>
		public RefreshResult() : this(null)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="RefreshResult"/> class
		/// </summary>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the current
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		public RefreshResult(NavigationData toData)
		{
			ToData = toData;
		}

		/// <summary>
		/// The <see cref="NavigationData"/> to be passed to the current <see cref="State"/> and
		/// stored in the <see cref="StateContext"/>
		/// </summary>
		public NavigationData ToData
		{
			get;
			private set;
		}

		/// <summary>
		/// Navigates via a call to <see cref="StateController.Refresh(NavigationData)"/>
		/// </summary>
		/// <param name="context">The context within which the result is executed</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="context"/> is null</exception>
		/// <exception cref="System.ArgumentException">There is <see cref="NavigationData"/> that cannot
		/// be converted to a <see cref="System.String"/></exception>
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been 
		/// supplied a value</exception>
		public override void ExecuteResult(ControllerContext context)
		{
			if (context == null)
			{
				throw new ArgumentNullException("context");
			}
			StateController.Refresh(ToData);
		}
	}
}
