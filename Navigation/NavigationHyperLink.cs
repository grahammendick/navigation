using System;
using System.ComponentModel;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation
{
	/// <summary>
	/// A control that displays a link that navigates to another <see cref="Navigation.State"/>. This can be 
	/// forward using an action parameter; backward via a <see cref="Navigation.Crumb"/>; or refreshing the
	/// current <see cref="Navigation.State"/>.
	/// </summary>
	public class NavigationHyperLink : HyperLink, IPostBackEventHandler
	{
		/// <summary>
		/// Gets or sets the <see cref="Navigation.NavigationData"/> to be passed to the next <see cref="Navigation.State"/>.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Forward"/>
		/// or <see cref="Navigation.NavigationDirection.Refresh"/>
		/// </summary>
		[Category("Navigation"), Description("The NavigationData to be passed."), DefaultValue(null), Bindable(true)]
		public NavigationData ToData
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets whether to include the <see cref="Navigation.StateContext.Data">State Context</see> together
		/// with the <see cref="ToData"/>. 
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Forward"/>
		/// or <see cref="Navigation.NavigationDirection.Refresh"/>
		/// </summary>
		[Category("Navigation"), Description("Specifies whether to include State Context together with the ToData."), DefaultValue(false), Bindable(true)]
		public bool IncludeCurrentData
		{
			get
			{
				return ViewState["IncludeCurrentData"] != null ? (bool)ViewState["IncludeCurrentData"] : false;
			}
			set
			{
				ViewState["IncludeCurrentData"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the key of a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/>.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Forward"/>
		/// </summary>
		[Category("Navigation"), Description("The key of a child Transition or Dialog."), DefaultValue(""), Bindable(true)]
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
		[Category("Navigation"), Description("The number of Crumb steps to go back."), DefaultValue(1), Bindable(true)]
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
		[Category("Navigation"), Description("The direction of the navigation."), DefaultValue(NavigationDirection.Forward), Bindable(true)]
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
		/// Gets or sets whether clicking the hyperlink will cause a PostBack if javascript is on. Can be used in conjunction
		/// with ASP.NET Ajax to implement the Single-Page Interface pattern that works with javascript off. 
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>.
		/// WARNING: With javascript off a GET request is issued, so only retrieval operations should follow from clicking 
		/// the hyperlink. To this end the post back event is neither validated nor raised
		/// </summary>
		[Category("Navigation"), Description("Specifies whether clicking the hyperlink will cause a PostBack if javascript is on."), DefaultValue(false), Bindable(true)]
		public bool PostBack
		{
			get
			{
				return ViewState["PostBack"] != null ? (bool)ViewState["PostBack"] : false;
			}
			set
			{
				ViewState["PostBack"] = value;
			}
		}

		/// <summary>
		/// Gets a Url to navigate to a <see cref="Navigation.State"/> depending on the <see cref="Direction"/>.
		/// This can be forward using an action parameter; backward via a <see cref="Navigation.Crumb"/>;
		/// or refreshing the current <see cref="Navigation.State"/>
		/// </summary>
		[Browsable(false)]
		public string Link
		{
			get
			{
				if (NavigateUrl.Length > 0)
					return NavigateUrl;
				NavigationData data = new NavigationData(IncludeCurrentData);
				UpdateData(data);
				switch (Direction)
				{
					case (NavigationDirection.Refresh):
						{
							return StateController.GetRefreshLink(data);
						}
					case (NavigationDirection.Back):
						{
							return StateController.GetNavigationBackLink(Distance);
						}
					default:
						{
							if (Action.Length == 0)
								return string.Empty;
							return StateController.GetNavigationLink(Action, data);
						}
				}
			}
		}

		private void UpdateData(NavigationData data)
		{
			if (ToData != null)
			{
				foreach (NavigationDataItem item in ToData)
				{
					data[item.Key] = item.Value;
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
			if (!DesignMode && Enabled && NavigateUrl.Length == 0)
			{
				NavigateUrl = Link;
				if (Direction == NavigationDirection.Refresh && PostBack)
				{
					StringBuilder sb = new StringBuilder();
					string onClick = Attributes["onclick"];
					if (!string.IsNullOrEmpty(onClick))
					{
						sb.Append(onClick);
						if (sb[sb.Length - 1] != ';')
							sb.Append(";");
						Attributes.Remove("onclick");
					}
					PostBackOptions postBackOptions = new PostBackOptions(this);
					postBackOptions.RequiresJavaScriptProtocol = sb.Length == 0;
					sb.Append(Page.ClientScript.GetPostBackEventReference(postBackOptions));
					sb.Append(";return false;");
					writer.AddAttribute(HtmlTextWriterAttribute.Onclick, sb.ToString());
				}
			}
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

		/// <summary>
		/// Updates <see cref="Navigation.StateContext.Data">State Context</see> when the <see cref="Navigation.NavigationHyperLink"/>
		/// posts back to the server
		/// </summary>
		/// <param name="eventArgument">The argument for the event</param>
		public virtual void RaisePostBackEvent(string eventArgument)
		{
			if (!IncludeCurrentData)
				StateContext.Data.Clear();
			UpdateData(StateContext.Data);
		}
	}
}
