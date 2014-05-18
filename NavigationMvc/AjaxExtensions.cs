using System;
using System.Collections.Generic;
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
			Dictionary<string, string> panels = new Dictionary<string, string>();
			NavigationData data = (NavigationData) htmlHelper.ViewContext.HttpContext.Items["oldData"];
			bool navigationDataChanged = navigationDataKeys == null;
			if (!navigationDataChanged && data != null)
			{
				foreach (string key in navigationDataKeys.Split(new char[] { ',' }))
				{
					navigationDataChanged = navigationDataChanged || data[key.Trim()] != StateContext.Data[key.Trim()];
				}
			}
			if (navigationDataChanged)
				panels["np1"] = content(null).ToString();
			htmlHelper.ViewContext.HttpContext.Items["panels"] = panels;
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));
		}
	}
}
