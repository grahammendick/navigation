using System;
using System.Web.Mvc;
using System.Web.WebPages;

namespace Navigation.Mvc
{
	public static class AjaxExtensions
	{
		public static MvcHtmlString AjaxPanel(this HtmlHelper htmlHelper, string id, string navigationDataKeys, Func<dynamic, HelperResult> content)
		{
			string html = content(null).ToHtmlString();
			NavigationData data = (NavigationData)htmlHelper.ViewContext.HttpContext.Items["oldData"];
			if (data != null)
			{
				if (NavigationDataChanged(navigationDataKeys, data))
				{
					AjaxNavigationInfo.GetInfo(htmlHelper.ViewContext.HttpContext).Panels[id] = html;
				}
			}
			TagBuilder tagBuilder = new TagBuilder("span");
			tagBuilder.MergeAttribute("id", id);
			tagBuilder.InnerHtml = html;
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));
		}

		private static bool NavigationDataChanged(string navigationDataKeys, NavigationData data)
		{
			if (string.IsNullOrEmpty(navigationDataKeys))
				return true;
			foreach (string key in navigationDataKeys.Split(new char[] { ',' }))
			{
				if (data[key.Trim()] != StateContext.Data[key.Trim()])
					return true;
			}
			return false;
		}
	}
}
