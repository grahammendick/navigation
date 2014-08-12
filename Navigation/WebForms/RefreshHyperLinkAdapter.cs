#if NET45Plus
using System;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.Adapters;

namespace Navigation
{
	/// <summary>
	/// An adapter that adds post back refresh navigation to a <see cref="System.Web.UI.WebControls.HyperLink"/>
	/// when its <see cref="System.Web.UI.WebControls.HyperLink.NavigateUrl"/> is set using RefreshPostBack markup.
	/// </summary>
	public class RefreshHyperLinkAdapter : WebControlAdapter, IPostBackEventHandler
	{
		private const string REFRESH_POST_BACK = "n2";

		private HyperLink HyperLink
		{
			get
			{
				return (HyperLink)Control;
			}
		}

		/// <summary>
		/// Adds an onclick attribute for post back refresh navigation when javascript is on
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void BeginRender(HtmlTextWriter writer)
		{
			if (HyperLink.Enabled && HyperLink.Attributes["__ToData"] != null)
			{
				PostBackOptions postBackOptions = new PostBackOptions(HyperLink);
				postBackOptions.Argument = REFRESH_POST_BACK;
				writer.AddAttribute(HtmlTextWriterAttribute.Onclick, string.Format(CultureInfo.InvariantCulture, "if(!event.ctrlKey&&!event.shiftKey){{{0};return false;}}", Page.ClientScript.GetPostBackEventReference(postBackOptions, true)));
			}
			HyperLink.Attributes.Remove("__ToData");
			base.BeginRender(writer);
		}

		/// <summary>
		/// Updates <see cref="Navigation.StateContext.Data">State Context</see> when the
		/// <see cref="System.Web.UI.WebControls.HyperLink"/> posts back to the server
		/// </summary>
		/// <param name="eventArgument">The argument for the event</param>
		public void RaisePostBackEvent(string eventArgument)
		{
			if (StringComparer.OrdinalIgnoreCase.Compare(eventArgument, REFRESH_POST_BACK) == 0)
			{
				Page.ClientScript.ValidateEvent(HyperLink.UniqueID, REFRESH_POST_BACK);
				NavigationData derivedData = new NavigationData(StateContext.State.Derived);
				NavigationData toData = StateInfoConfig.ParseNavigationDataExpression(HyperLink.Attributes["__ToData"], StateContext.State, true);
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
#endif