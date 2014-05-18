using System;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public static class AjaxExtensions
	{
		public static MvcHtmlString AjaxPanel(this HtmlHelper htmlHelper, string navigationDataKeys, Func<dynamic, object> content)
		{
			TagBuilder tagBuilder = new TagBuilder("span");
			tagBuilder.MergeAttribute("id", "np1");
			tagBuilder.InnerHtml = content(null).ToString();
			htmlHelper.ViewContext.HttpContext.Items["np1"] = content(null).ToString();
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));
		}
	}
}
