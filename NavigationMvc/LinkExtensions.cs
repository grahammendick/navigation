using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public static class LinkExtensions
	{
		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action)
		{
			return NavigationLink(htmlHelper, linkText, action, null, null);
		}

		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, NavigationData toData)
		{
			return NavigationLink(htmlHelper, linkText, action, toData, null);
		}

		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, IDictionary<string, object> htmlAttributes)
		{
			return NavigationLink(htmlHelper, linkText, action, null, htmlAttributes);
		}

		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, NavigationData toData, IDictionary<string, object> htmlAttributes)
		{
			return GenerateLink(htmlHelper, linkText, StateController.GetNavigationLink(action, toData), htmlAttributes);
		}

		public static MvcHtmlString NavigationBackLink(this HtmlHelper htmlHelper, string linkText, int distance)
		{
			return NavigationBackLink(htmlHelper, linkText, distance, null);
		}

		public static MvcHtmlString NavigationBackLink(this HtmlHelper htmlHelper, string linkText, int distance, IDictionary<string, object> htmlAttributes)
		{
			return GenerateLink(htmlHelper, linkText, StateController.GetNavigationBackLink(distance), htmlAttributes);
		}

		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText)
		{
			return RefreshLink(htmlHelper, linkText, null, null);
		}

		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, NavigationData toData)
		{
			return RefreshLink(htmlHelper, linkText, toData, null);
		}

		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, IDictionary<string, object> htmlAttributes)
		{
			return RefreshLink(htmlHelper, linkText, null, htmlAttributes);
		}

		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, NavigationData toData, IDictionary<string, object> htmlAttributes)
		{
			return GenerateLink(htmlHelper, linkText, StateController.GetRefreshLink(toData), htmlAttributes);
		}

		private static MvcHtmlString GenerateLink(this HtmlHelper htmlHelper, string linkText, string url, IDictionary<string, object> htmlAttributes)
		{
			TagBuilder tagBuilder = new TagBuilder("a")
			{
				InnerHtml = !string.IsNullOrEmpty(linkText) ? HttpUtility.HtmlEncode(linkText) : string.Empty
			};
			tagBuilder.MergeAttributes<string, object>(htmlAttributes);
			tagBuilder.MergeAttribute("href", url);
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));

		}
	}
}
