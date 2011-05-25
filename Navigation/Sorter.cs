using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation
{
	/// <summary>
	/// Provides sorting functionality for any data-bound controls, typically used in conjunction with the
	/// <see cref="System.Web.UI.WebControls.ObjectDataSource"/> control.
	/// </summary>
	public class Sorter : CompositeControl
	{
		/// <summary>
		/// Gets or sets the SortExpression <see cref="Navigation.NavigationData"/> key
		/// </summary>
		[Category("Navigation"), Description("The SortExpression NavigationData key."), DefaultValue("sortExpression")]
		public string SortExpressionKey
		{
			get
			{
				return !string.IsNullOrEmpty((string)ViewState["SortExpressionKey"]) ? (string)ViewState["SortExpressionKey"] : "sortExpression";
			}
			set
			{
				ViewState["SortExpressionKey"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the sort expression to <see cref="Navigation.StateContext.Data">Context Data</see>
		/// </summary>
		[Browsable(false)]
		public string SortExpression
		{
			get
			{
				return StateContext.Data[SortExpressionKey] != null ? (string)StateContext.Data[SortExpressionKey] : string.Empty;
			}
			set
			{
				StateContext.Data[SortExpressionKey] = value;
			}
		}

		/// <summary>
		/// Gets or sets the column name to sort by
		/// </summary>
		[Category("Behavior"), Description("The column name to sort by."), DefaultValue("")]
		public string SortBy
		{
			get
			{
				return ViewState["SortBy"] != null ? (string)ViewState["SortBy"] : string.Empty;
			}
			set
			{
				ViewState["SortBy"] = value;
			}
		}

		/// <summary>
		/// Gets or sets whether the first time the sort is clicked the sort order is descending
		/// </summary>
		[Category("Behavior"), Description("Indicates whether the default sort order is descending."), DefaultValue(false)]
		public bool DefaultDescending
		{
			get
			{
				return ViewState["DefaultAscending"] != null ? (bool)ViewState["DefaultAscending"] : false;
			}
			set
			{
				ViewState["DefaultAscending"] = value;
			}
		}

		/// <summary>
		/// Gets or sets whether sorting should cause a navigation
		/// </summary>
		[Category("Navigation"), Description("Indicates whether sorting should cause a navigation."), DefaultValue(false)]
		public bool Navigate
		{
			get
			{
				return ViewState["Navigate"] != null ? (bool)ViewState["Navigate"] : false;
			}
			set
			{
				ViewState["Navigate"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the button type.
		/// This is only relevant if <see cref="Navigate"/> is false
		/// </summary>
		[Category("Appearance"), Description("The type of button."), DefaultValue(ButtonType.Button)]
		public ButtonType ButtonType
		{
			get
			{
				return ViewState["ButtonType"] != null ? (ButtonType)ViewState["ButtonType"] : ButtonType.Button;
			}
			set
			{
				ViewState["ButtonType"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the text
		/// </summary>
		[Category("Appearance"), Description("The text to display."), DefaultValue("")]
		public string Text
		{
			get
			{
				return ViewState["Text"] != null ? (string)ViewState["Text"] : string.Empty;
			}
			set
			{
				ViewState["Text"] = value;
			}
		}

		/// <summary>
		/// Gets or sets Url of the image.
		/// This is only relevant if <see cref="ButtonType"/> is <see cref="System.Web.UI.WebControls.ButtonType.Image"/>
		/// </summary>
		[Category("Appearance"), Description("The Url of the image if the ButtonType is Image."), DefaultValue("")]
		public string ImageUrl
		{
			get
			{
				return ViewState["ImageUrl"] != null ? (string)ViewState["ImageUrl"] : string.Empty;
			}
			set
			{
				ViewState["ImageUrl"] = value;
			}
		}

		/// <summary>
		/// Gets the <see cref="System.Web.UI.WebControls.SortDirection"/> from the <see cref="SortExpression"/>
		/// </summary>
		public SortDirection? Direction
		{
			get
			{
				if (SortExpression == SortBy)
					return SortDirection.Ascending;
				if (SortExpression == SortBy + " DESC")
					return SortDirection.Descending;
				return null;
			}
		}

		private Button SortButton
		{
			get;
			set;
		}

		private ImageButton SortImageButton
		{
			get;
			set;
		}

		private LinkButton SortLinkButton
		{
			get;
			set;
		}

		private NavigationHyperLink SortHyperLink
		{
			get;
			set;
		}

		/// <summary>
		/// Creates the child controls that make up the <see cref="Navigation.Sorter"/> control
		/// </summary>
		protected override void CreateChildControls()
		{
			Controls.Clear();
			SortButton = new Button();
			SortImageButton = new ImageButton();
			SortLinkButton = new LinkButton();
			SortHyperLink = new NavigationHyperLink();
			SortButton.EnableViewState = false;
			SortImageButton.EnableViewState = false;
			SortLinkButton.EnableViewState = false;
			SortHyperLink.EnableViewState = false;
			SortButton.CausesValidation = false;
			SortImageButton.CausesValidation = false;
			SortLinkButton.CausesValidation = false;
			SortButton.EnableTheming = false;
			SortImageButton.EnableTheming = false;
			SortLinkButton.EnableTheming = false;
			SortHyperLink.EnableTheming = false;
			SortHyperLink.Direction = NavigationDirection.Refresh;
			SortButton.Command += SortClicked;
			SortImageButton.Command += SortClicked;
			SortLinkButton.Command += SortClicked;
			Controls.Add(SortButton);
			Controls.Add(SortImageButton);
			Controls.Add(SortLinkButton);
			Controls.Add(SortHyperLink);
		}

		private void SortClicked(object sender, CommandEventArgs e)
		{
			SortExpression = GetSortExpression();
		}

		private string GetSortExpression()
		{
			switch (Direction)
			{
				case (SortDirection.Ascending):
					return SortBy + " DESC";
				case (SortDirection.Descending):
					return SortBy;
				default:
					return !DefaultDescending ? SortBy : SortBy + " DESC";
			}
		}

		private void SetChildProperties()
		{
			EnsureChildControls();
			SortButton.Visible = false;
			SortImageButton.Visible = false;
			SortLinkButton.Visible = false;
			SortHyperLink.Visible = false;
			WebControl control = null;
			if (!Navigate)
			{
				switch (ButtonType)
				{
					case (ButtonType.Button):
						SortButton.Text = Text;
						control = SortButton;
						break;
					case (ButtonType.Image):
						SortImageButton.AlternateText = Text;
						SortImageButton.ImageUrl = ImageUrl;
						control = SortImageButton;
						break;
					case (ButtonType.Link):
						SortLinkButton.Text = Text;
						control = SortLinkButton;
						break;
				}
			}
			else
			{
				SortHyperLink.Text = Text;
				SortHyperLink.ImageUrl = ImageUrl;
				SortHyperLink.ToData = new NavigationData(true);
				SortHyperLink.ToData[SortExpressionKey] = GetSortExpression();
				control = SortHyperLink;
			}
			control.CopyBaseAttributes(this);
			control.ApplyStyle(ControlStyle);
			control.Visible = true;
		}

		/// <summary>
		/// Renders the <see cref="Navigation.Sorter"/> control to the specified <paramref name="writer"/>
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void Render(HtmlTextWriter writer)
		{
			RenderContents(writer);
		}

		/// <summary>
		/// Renders the contents of the <see cref="Navigation.Sorter"/> control to the specified <paramref name="writer"/>
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void RenderContents(HtmlTextWriter writer)
		{
			SetChildProperties();
			base.RenderContents(writer);
		}
	}
}
