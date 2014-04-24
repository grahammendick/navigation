using System.Web;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public static class LinkExtensions
	{
		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action)
		{
			return NavigationLink(htmlHelper, linkText, action, null);
		}

		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, NavigationData toData)
		{
			TagBuilder tagBuilder = new TagBuilder("a")
			{
				InnerHtml = !string.IsNullOrEmpty(linkText) ? HttpUtility.HtmlEncode(linkText) : string.Empty
			};
			tagBuilder.MergeAttribute("href", StateController.GetNavigationLink(action, toData));
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));
		}
	}
}
