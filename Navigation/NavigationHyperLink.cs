using System;
using System.ComponentModel;
using System.Globalization;
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
		/// Gets or sets a value indicating whether <see cref="ToData"/> values should be converted to null 
		/// if they are <see cref="System.String.Empty"/>.
		/// This is only relevant if the <see cref="Direction"/> is <see cref="Navigation.NavigationDirection.Refresh"/>
		/// and <see cref="PostBack"/> is set to true and javascript is on
		/// </summary>
		[Category("Navigation"), Description("Specifies whether empty string ToData values will be converted to null."), DefaultValue(true)]
		public bool ConvertEmptyStringToNull
		{
			get
			{
				return ViewState["ConvertEmptyStringToNull"] != null ? (bool)ViewState["ConvertEmptyStringToNull"] : true;
			}
			set
			{
				ViewState["ConvertEmptyStringToNull"] = value;
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
		/// Gets or sets the CSS class to apply when the <see cref="Navigation.NavigationHyperLink"/> is <see cref="Inert"/>
		/// </summary>
		[Category("Behavior"), Description("The CSS class to apply when Inert."), DefaultValue("")]
		public string InertCssClass
		{
			get
			{
				return ViewState["InertCssClass"] != null ? (string)ViewState["InertCssClass"] : string.Empty;
			}
			set
			{
				ViewState["InertCssClass"] = value;
			}
		}

		/// <summary>
		/// Gets or sets a value indicating whether to disable the <see cref="Navigation.NavigationHyperLink"/> when
		/// it is <see cref="Inert"/>
		/// </summary>
		[Category("Behavior"), Description("Specifies whether to disable when Inert."), DefaultValue(false)]
		public bool DisableInert
		{
			get
			{
				return ViewState["DisableInert"] != null ? (bool)ViewState["DisableInert"] : false;
			}
			set
			{
				ViewState["DisableInert"] = value;
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
		/// Gets or sets an anchor identifying a specific location within the HTML
		/// </summary>
		[Category("Behavior"), Description("Anchor identifying a specific location within the HTML."), DefaultValue("")]
		public string FragmentIdentifier
		{
			get
			{
				return ViewState["FragmentIdentifier"] != null ? (string)ViewState["FragmentIdentifier"] : string.Empty;
			}
			set
			{
				ViewState["FragmentIdentifier"] = value;
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
				if (!string.IsNullOrEmpty(NavigateUrl))
					return NavigateUrl;
				NavigationData data = new NavigationData(IncludeCurrentData);
				UpdateData(data);
				switch (Direction)
				{
					case (NavigationDirection.Refresh):
						{
							return AppendHash(StateController.GetRefreshLink(data));
						}
					case (NavigationDirection.Back):
						{
							return AppendHash(StateController.GetNavigationBackLink(Distance));
						}
					default:
						{
							if (Action.Length == 0)
								return string.Empty;
							return AppendHash(StateController.GetNavigationLink(Action, data));
						}
				}
			}
		}

		/// <summary>
		/// Gets a value indicating whether clicking the <see cref="Navigation.NavigationHyperLink"/> will leave
		/// the state context <see cref="Navigation.StateContext.State"/> and <see cref="Navigation.StateContext.Data"/>
		/// unchanged
		/// </summary>
		[Browsable(false)]
		public bool Inert
		{
			get
			{
				if (Direction != NavigationDirection.Refresh) return false;
				NavigationData data = new NavigationData(IncludeCurrentData);
				data.SetDefaults(StateContext.State.Defaults);
				UpdateData(data);
				if (data.Count != StateContext.Data.Count)
					return false;
				foreach (NavigationDataItem item in data)
				{
					if (!item.Value.Equals(StateContext.Data[item.Key]))
						return false;
				}
				return true;
			}
		}

		private void UpdateData(NavigationData data)
		{
			if (ToData != null)
			{
				foreach (NavigationDataItem item in ToData)
				{
					data[item.Key] = (!item.Value.Equals(string.Empty) || !ConvertEmptyStringToNull) ? item.Value : null;
				}
			}
		}

		private string AppendHash(string url)
		{
			if (FragmentIdentifier.Length != 0)
				url += "#" + FragmentIdentifier;
			return url;
		}

		/// <summary>
		/// Sets the Url depending on the <see cref="Direction"/> and adds the attributes of 
		/// a <see cref="Navigation.NavigationHyperLink"/> control to the output stream for rendering 
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void AddAttributesToRender(HtmlTextWriter writer)
		{
			if (DesignMode && Enabled && string.IsNullOrEmpty(NavigateUrl))
				writer.AddAttribute(HtmlTextWriterAttribute.Href, "#");
			if (!DesignMode && ((DisableInert && Enabled) || InertCssClass.Length != 0) && Inert)
			{
				if (DisableInert)
					Enabled = false;
				if (InertCssClass.Length != 0)
				{
					if (string.IsNullOrEmpty(CssClass))
						CssClass = InertCssClass;
					else
						CssClass = InertCssClass + " " + CssClass;
				}
			}
			if (!DesignMode && Enabled && string.IsNullOrEmpty(NavigateUrl))
			{
				NavigateUrl = Link;
				if (Direction == NavigationDirection.Refresh && PostBack)
				{
					PostBackOptions postBackOptions = new PostBackOptions(this);
					postBackOptions.RequiresJavaScriptProtocol = true;
					writer.AddAttribute(HtmlTextWriterAttribute.Onclick, string.Format(CultureInfo.InvariantCulture, "{0};return false", Page.ClientScript.GetPostBackEventReference(postBackOptions, true)));
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
