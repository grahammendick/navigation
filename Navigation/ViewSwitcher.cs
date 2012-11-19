using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.WebPages;

namespace Navigation
{
	/// <summary>
	/// A control that displays a link that switches between mobile and desktop views. Mobile specific settings
	/// can be configured in StateInfo for a <see cref="Navigation.State"/>'s page, route, master pages and theme
	/// </summary>
	public class ViewSwitcher : CompositeControl
	{
		/// <summary>
		/// Gets or sets the View <see cref="Navigation.NavigationData"/> key
		/// </summary>
		[Category("Navigation"), Description("The View NavigationData key."), DefaultValue("view")]
		public string ViewKey
		{
			get
			{
				return !string.IsNullOrEmpty((string)ViewState["ViewKey"]) ? (string)ViewState["ViewKey"] : "view";
			}
			set
			{
				ViewState["ViewKey"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the switch to desktop text
		/// </summary>
		[Category("Appearance"), Description("The switch to desktop text to display."), DefaultValue("")]
		public string DesktopSwitchText
		{
			get
			{
				return ViewState["DesktopSwitchText"] != null ? (string)ViewState["DesktopSwitchText"] : string.Empty;
			}
			set
			{
				ViewState["DesktopSwitchText"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the switch to mobile text
		/// </summary>
		[Category("Appearance"), Description("The switch to mobile text to display."), DefaultValue("")]
		public string MobileSwitchText
		{
			get
			{
				return ViewState["MobileSwitchText"] != null ? (string)ViewState["MobileSwitchText"] : string.Empty;
			}
			set
			{
				ViewState["MobileSwitchText"] = value;
			}
		}

		/// <summary>
		/// Gets or sets Url of the switch to desktop image
		/// </summary>
		[Category("Appearance"), Description("The Url of the switch to desktop image."), DefaultValue("")]
		public string DesktopSwitchImageUrl
		{
			get
			{
				return ViewState["DesktopSwitchImageUrl"] != null ? (string)ViewState["DesktopSwitchImageUrl"] : string.Empty;
			}
			set
			{
				ViewState["DesktopSwitchImageUrl"] = value;
			}
		}

		/// <summary>
		/// Gets or sets Url of the switch to mobile image
		/// </summary>
		[Category("Appearance"), Description("The Url of the switch to mobile image."), DefaultValue("")]
		public string MobileSwitchImageUrl
		{
			get
			{
				return ViewState["MobileSwitchImageUrl"] != null ? (string)ViewState["MobileSwitchImageUrl"] : string.Empty;
			}
			set
			{
				ViewState["MobileSwitchImageUrl"] = value;
			}
		}

		/// <summary>
		/// Gets or sets whether the <see cref="Navigation.ViewSwitcher"/> is shown only when the
		/// <see cref="System.Web.UI.Page"/> is first loaded
		/// </summary>
		[Category("Behavior"), Description("Indicates whether it's only shown when the Page is first loaded."), DefaultValue(false)]
		public bool HideOnPostBack
		{
			get
			{
				return ViewState["HideOnPostBack"] != null ? (bool)ViewState["HideOnPostBack"] : false;
			}
			set
			{
				ViewState["HideOnPostBack"] = value;
			}
		}

		/// <summary>
		/// Gets or sets whether the <see cref="Navigation.ViewSwitcher"/> is hidden if there is no
		/// mobile specific <see cref="Navigation.State"/> information
		/// </summary>
		[Category("Behavior"), Description("Indicates whether it's hidden if there's no mobile specific config."), DefaultValue(false)]
		public bool HideNoOverride
		{
			get
			{
				return ViewState["HideNoOverride"] != null ? (bool)ViewState["HideNoOverride"] : false;
			}
			set
			{
				ViewState["HideNoOverride"] = value;
			}
		}

		private bool Mobile
		{
			get
			{
				return ViewState["Mobile"] != null ? (bool)ViewState["Mobile"] : false;
			}
			set
			{
				ViewState["Mobile"] = value;
			}
		}

		private NavigationHyperLink ViewSwitchHyperLink
		{
			get;
			set;
		}

		private static bool HasOverride
		{
			get
			{
				return StateContext.State.MobileOverride;
			}
		}

		/// <summary>
		/// Creates the child controls that make up the <see cref="Navigation.ViewSwitcher"/> control
		/// </summary>
		protected override void CreateChildControls()
		{
			Controls.Clear();
			ViewSwitchHyperLink = new NavigationHyperLink();
			ViewSwitchHyperLink.EnableViewState = false;
			ViewSwitchHyperLink.EnableTheming = false;
			ViewSwitchHyperLink.Direction = NavigationDirection.Refresh;
			ViewSwitchHyperLink.IncludeCurrentData = true;
			Controls.Add(ViewSwitchHyperLink);
		}

		/// <summary>
		/// Raises the <see cref="System.Web.UI.Control.OnLoad"/> event
		/// </summary>
		/// <param name="e">The event data</param>
		protected override void OnLoad(System.EventArgs e)
		{
			if (!Page.IsPostBack)
			{
				HttpContextBase context = new HttpContextWrapper(Context);
				Mobile = context.GetOverriddenBrowser().IsMobileDevice;
				string view = (string)StateContext.Data[ViewKey];
				StateContext.Data[ViewKey] = null;
				if (view != null)
				{
					if ((Page.Request.Browser.IsMobileDevice && view == "mobile")
						|| (!Page.Request.Browser.IsMobileDevice && view != "mobile"))
						context.ClearOverriddenBrowser();
					else
						context.SetOverriddenBrowser(view == "mobile" ? BrowserOverride.Mobile : BrowserOverride.Desktop);
					StateController.Refresh(new NavigationData(true));
				}
			}
			base.OnLoad(e);
		}

		private void SetChildProperties()
		{
			EnsureChildControls();
			ViewSwitchHyperLink.Text = Mobile ? DesktopSwitchText : MobileSwitchText;
			ViewSwitchHyperLink.ImageUrl = Mobile ? DesktopSwitchImageUrl : MobileSwitchImageUrl;
			ViewSwitchHyperLink.ToData = new NavigationData();
			ViewSwitchHyperLink.ToData[ViewKey] = Mobile ? "desktop" : "mobile";
			ViewSwitchHyperLink.CopyBaseAttributes(this);
			ViewSwitchHyperLink.ApplyStyle(ControlStyle);
		}

		/// <summary>
		/// Renders the <see cref="Navigation.ViewSwitcher"/> control to the specified 
		/// <paramref name="writer"/>
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void Render(HtmlTextWriter writer)
		{
			RenderContents(writer);
		}

		/// <summary>
		/// Renders the contents of the <see cref="Navigation.ViewSwitcher"/> control to 
		/// the specified <paramref name="writer"/>
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void RenderContents(HtmlTextWriter writer)
		{
			if (!DesignMode){
				if ((Page.IsPostBack && HideOnPostBack) || (!HasOverride && HideNoOverride))
					return;
			}
			SetChildProperties();
			if (!string.IsNullOrEmpty(ID))
				writer.AddAttribute(HtmlTextWriterAttribute.Id, ClientID);
			base.RenderContents(writer);
		}
	}
}
