using System;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation
{
	/// <summary>
	/// A control that displays a link that navigates to another <see cref="Navigation.State"/>. This can be 
	/// forward using an action parameter; backward via a <see cref="Navigation.Crumb"/>; or refreshing the
	/// current <see cref="Navigation.State"/>.
	/// </summary>
	public class NavigationHyperLink : HyperLink
	{
		/// <summary>
		/// Gets or sets the <see cref="Navigation.NavigationData"/> to be passed to the next <see cref="Navigation.State"/>.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Forward"/>
		/// or <see cref="Navigation.NavigationDirection.Refresh"/>
		/// </summary>
		public NavigationData ToData
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the key of a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/>.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Forward"/>
		/// </summary>
		public string Action
		{
			get
			{
				return ViewState["Action"] != null ? (string)ViewState["Action"] : string.Empty;
			}
			set
			{
				ViewState["Action"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the number of <see cref="Crumb"/> steps to go back, starting at 1.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Back"/>
		/// </summary>
		public int Distance
		{
			get
			{
				return ViewState["Distance"] != null ? (int)ViewState["Distance"] : 1;
			}
			set
			{
				ViewState["Distance"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the direction of the navigation
		/// </summary>
		public NavigationDirection Direction
		{
			get
			{
				return ViewState["Direction"] != null ? (NavigationDirection)ViewState["Direction"] : NavigationDirection.Forward;
			}
			set
			{
				ViewState["Direction"] = value;
			}
		}

		/// <summary>
		///  Gets a Url to navigate to a <see cref="Navigation.State"/> depending on the <see cref="Direction"/>.
		///  This can be forward using an action parameter; backward via a <see cref="Navigation.Crumb"/>;
		///  or refreshing the current <see cref="Navigation.State"/>
		/// </summary>
		public string Link
		{
			get
			{
				if (NavigateUrl.Length > 0)
					return NavigateUrl;
				switch (Direction)
				{
					case (NavigationDirection.Refresh):
						{
							return StateController.GetRefreshLink(ToData);
						}
					case (NavigationDirection.Back):
						{
							return StateController.GetNavigationBackLink(Distance);
						}
					default:
						{
							if (Action.Length == 0)
								return string.Empty;
							return StateController.GetNavigationLink(Action, ToData);
						}
				}
			}
		}

		/// <summary>
		/// Sets the Url depending on the <see cref="Direction"/> and adds the attributes of 
		/// a <see cref="Navigation.NavigationHyperLink"/> control to the output stream for rendering 
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void AddAttributesToRender(HtmlTextWriter writer)
		{
			if (!DesignMode)
				NavigateUrl = Link;
			base.AddAttributesToRender(writer);
		}

		/// <summary>
		/// Loads the previously saved view state of the <see cref="Navigation.NavigationHyperLink"/>
		/// </summary>
		/// <param name="savedState">The saved view state values for the control</param>
		protected override void LoadViewState(object savedState)
		{
			if (savedState == null)
			{
				base.LoadViewState(null);
			}
			else
			{
				Pair pair = (Pair)savedState;
				base.LoadViewState(pair.First);
				if (pair.Second != null)
				{
					ToData = new NavigationData();
					((IStateManager)ToData).LoadViewState(pair.Second);
				}
			}
		}

		/// <summary>
		/// Saves the view state of the <see cref="Navigation.NavigationHyperLink"/>
		/// </summary>
		/// <returns>Returns the view state of the <see cref="Navigation.NavigationHyperLink"/></returns>
		protected override object SaveViewState()
		{
			Pair pair = new Pair
			{
				First = base.SaveViewState()
			};
			if (ToData != null)
				pair.Second = ((IStateManager)ToData).SaveViewState();
			if (pair.First == null && pair.Second == null)
				return null;
			return pair;
		}
	}
}
