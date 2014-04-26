using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace Navigation.Mvc
{
	public static class FormExtensions
	{
		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action)
		{
			return BeginNavigationForm(htmlHelper, action, null, null);
		}

		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action, NavigationData toData)
		{
			return BeginNavigationForm(htmlHelper, action, toData, null);
		}

		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action, IDictionary<string, object> htmlAttributes)
		{
			return BeginNavigationForm(htmlHelper, action, null, htmlAttributes);
		}

		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action, NavigationData toData, IDictionary<string, object> htmlAttributes)
		{
			return GenerateForm(htmlHelper, StateController.GetNavigationLink(action, toData), htmlAttributes);
		}

		public static MvcForm BeginNavigationBackForm(this HtmlHelper htmlHelper, int distance)
		{
			return BeginNavigationBackForm(htmlHelper, distance, null);
		}

		public static MvcForm BeginNavigationBackForm(this HtmlHelper htmlHelper, int distance, IDictionary<string, object> htmlAttributes)
		{
			return GenerateForm(htmlHelper, StateController.GetNavigationBackLink(distance), htmlAttributes);
		}

		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper)
		{
			return BeginRefreshForm(htmlHelper, null, null);
		}

		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper, NavigationData toData)
		{
			return BeginRefreshForm(htmlHelper, toData, null);
		}

		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper, IDictionary<string, object> htmlAttributes)
		{
			return BeginRefreshForm(htmlHelper, null, htmlAttributes);
		}

		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper, NavigationData toData, IDictionary<string, object> htmlAttributes)
		{
			return GenerateForm(htmlHelper, StateController.GetRefreshLink(toData), htmlAttributes);
		}

		private static MvcForm GenerateForm(this HtmlHelper htmlHelper, string url, IDictionary<string, object> htmlAttributes)
		{
			TagBuilder tagBuilder = new TagBuilder("form");
			tagBuilder.MergeAttributes<string, object>(htmlAttributes);
			tagBuilder.MergeAttribute("action", url);
			tagBuilder.MergeAttribute("method", "post");
			htmlHelper.ViewContext.Writer.Write(tagBuilder.ToString(TagRenderMode.StartTag));
			return new MvcForm(htmlHelper.ViewContext);
		}
	}
}
