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
