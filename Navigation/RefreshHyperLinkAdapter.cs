using System;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.Adapters;

namespace Navigation
{
	/// <summary>
	/// An adapter that adds refresh navigation to a <see cref="System.Web.UI.WebControls.HyperLink"/> when
	/// its <see cref="System.Web.UI.WebControls.HyperLink.NavigateUrl"/> is set using RefreshPostBack markup.
	/// </summary>
	public class RefreshHyperLinkAdapter : WebControlAdapter, IPostBackEventHandler
	{
		private HyperLink HyperLink
		{
			get
			{
				return (HyperLink)Control;
			}
		}

		private NavigationData ToData
		{
			get
			{
				if (HyperLink.Attributes["__ToData"].Length == 0)
					return null;
				return StateInfoConfig.ParseNavigationDataExpression(HyperLink.Attributes["__ToData"], StateContext.State, true);
			}
		}

		/// <summary>
		/// Sets the Url for refresh navigation and adds an onclick attribute for when javascript is on
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void BeginRender(HtmlTextWriter writer)
		{
			if (HyperLink.Enabled && HyperLink.Attributes["__ToData"] != null)
			{
				HyperLink.NavigateUrl = StateController.GetRefreshLink(ToData);
				PostBackOptions postBackOptions = new PostBackOptions(HyperLink);
				postBackOptions.RequiresJavaScriptProtocol = true;
				postBackOptions.Argument = "RefreshPostBack";
				writer.AddAttribute(HtmlTextWriterAttribute.Onclick, string.Format(CultureInfo.InvariantCulture, "{0};return false", Page.ClientScript.GetPostBackEventReference(postBackOptions, true)));
			}
			HyperLink.Attributes.Remove("__ToData");
			base.BeginRender(writer);
		}

		/// <summary>
		/// Updates <see cref="Navigation.StateContext.Data">State Context</see> when the <see cref="System.Web.UI.WebControls.HyperLink"/>
		/// posts back to the server
		/// </summary>
		/// <param name="eventArgument">The argument for the event</param>
		public void RaisePostBackEvent(string eventArgument)
		{
			if (StringComparer.OrdinalIgnoreCase.Compare(eventArgument, "RefreshPostBack") == 0)
			{
				Page.ClientScript.ValidateEvent(HyperLink.UniqueID, "RefreshPostBack");
				NavigationData derivedData = new NavigationData(StateContext.State.Derived);
				NavigationData toData = ToData;
				StateContext.Data.Clear();
				StateContext.Data.Add(toData);
				StateContext.Data.Add(derivedData);
			}
			else
			{
				((IPostBackEventHandler)HyperLink).RaisePostBackEvent(eventArgument);
			}
		}
	}
}
