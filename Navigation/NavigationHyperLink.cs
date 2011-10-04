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
		private static readonly object EventClick = new object();
		private static readonly object EventCommand = new object();

		/// <summary>
		/// Gets or sets the <see cref="Navigation.NavigationData"/> to be passed to the next <see cref="Navigation.State"/>.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Forward"/>
		/// or <see cref="Navigation.NavigationDirection.Refresh"/>
		/// </summary>
		[Category("Navigation"), Description("The NavigationData to be passed."), DefaultValue(null)]
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
		[Category("Navigation"), Description("Specifies whether to include State Context together with the ToData."), DefaultValue(false)]
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
		[Category("Navigation"), Description("The key of a child Transition or Dialog."), DefaultValue("")]
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
		[Category("Navigation"), Description("The number of Crumb steps to go back."), DefaultValue(1)]
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
		[Category("Navigation"), Description("The direction of the navigation."), DefaultValue(NavigationDirection.Forward)]
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
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>
		/// and javascript is on
		/// </summary>
		[Category("Behavior"), Description("Specifies whether clicking the hyperlink will cause a PostBack if Direction is Refresh and javascript is on."), DefaultValue(false)]
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
		/// Gets or sets the command name. This value is passed to the <see cref="Command"/> event handler along with the
		/// <see cref="CommandArgument"/>.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>
		/// and <see cref="PostBack"/> is set to true and javascript is on
		/// </summary>
		[Category("Behavior"), Description("The command raised if Direction is Refresh, PostBack is true and javascript is on."), DefaultValue("")]
		public string CommandName
		{
			get
			{
				return ViewState["CommandName"] != null ? (string)ViewState["CommandName"] : string.Empty;
			}
			set
			{
				ViewState["CommandName"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the command argument. This value is passed to the <see cref="Command"/> event handler along with the
		/// <see cref="CommandName"/>.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>
		/// and <see cref="PostBack"/> is set to true and javascript is on
		/// </summary>
		[Category("Behavior"), Description("The command argument passed if Direction is Refresh, PostBack is true and javascript is on."), DefaultValue("")]
		public string CommandArgument
		{
			get
			{
				return ViewState["CommandArgument"] != null ? (string)ViewState["CommandArgument"] : string.Empty;
			}
			set
			{
				ViewState["CommandArgument"] = value;
			}
		}

		/// <summary>
		/// Occurs when the <see cref="Navigation.NavigationHyperLink"/> is clicked.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>
		/// and <see cref="PostBack"/> is set to true and javascript is on
		/// </summary>
		[Category("Action"), Description("Fires when the link is clicked if Direction is Refresh, PostBack is true and javascript is on.")]
		public event EventHandler Click
		{
			add
			{
				Events.AddHandler(EventClick, value);
			}
			remove
			{
				Events.RemoveHandler(EventClick, value);
			}
		}

		/// <summary>
		/// Occurs when the <see cref="Navigation.NavigationHyperLink"/> is clicked.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>
		/// and <see cref="PostBack"/> is set to true and javascript is on
		/// </summary>
		[Category("Action"), Description("Fires when the link is clicked if Direction is Refresh, PostBack is true and javascript is on.")]
		public event CommandEventHandler Command
		{
			add
			{
				Events.AddHandler(EventCommand, value);
			}
			remove
			{
				Events.RemoveHandler(EventCommand, value);
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
					PostBackOptions postBackOptions = new PostBackOptions(this);
					postBackOptions.RequiresJavaScriptProtocol = true;
					writer.AddAttribute(HtmlTextWriterAttribute.Onclick, string.Format("{0};return false", Page.ClientScript.GetPostBackEventReference(postBackOptions, true)));
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
		/// Raises the <see cref="Click"/> event.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>
		/// and <see cref="PostBack"/> is set to true and javascript is on
		/// </summary>
		/// <param name="e"><see cref="System.EventArgs"/> containing the event data</param>
		protected virtual void OnClick(EventArgs e)
		{
			EventHandler eventHandler = (EventHandler) Events[EventClick];
			if (eventHandler != null)
				eventHandler(this, e);
		}

		/// <summary>
		/// Raises the <see cref="Command"/> event.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>
		/// and <see cref="PostBack"/> is set to true and javascript is on
		/// </summary>
		/// <param name="e"><see cref="System.Web.UI.WebControls.CommandEventArgs"/> containing the event data</param>
		protected virtual void OnCommand(CommandEventArgs e)
		{
			CommandEventHandler commandEventHandler = (CommandEventHandler)Events[EventCommand];
			if (commandEventHandler != null)
				commandEventHandler(this, e);
			RaiseBubbleEvent(this, e);
		}

		/// <summary>
		/// Updates <see cref="Navigation.StateContext.Data">State Context</see> when the <see cref="Navigation.NavigationHyperLink"/>
		/// posts back to the server
		/// </summary>
		/// <param name="eventArgument">The argument for the event</param>
		public virtual void RaisePostBackEvent(string eventArgument)
		{
			Page.ClientScript.ValidateEvent(UniqueID);
			if (!IncludeCurrentData)
				StateContext.Data.Clear();
			UpdateData(StateContext.Data);
			OnClick(EventArgs.Empty);
			OnCommand(new CommandEventArgs(CommandName, CommandArgument));
		}
	}
}
