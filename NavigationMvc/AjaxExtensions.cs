using System;
using System.Web.Mvc;
using System.Web.WebPages;

namespace Navigation.Mvc
{
	public static class AjaxExtensions
	{
		public static MvcHtmlString AjaxPanel(this HtmlHelper htmlHelper, string id, string navigationDataKeys, Func<dynamic, HelperResult> content)
		{
			string html = null;
			if (NavigationDataChanged(htmlHelper, navigationDataKeys))
			{
				AjaxNavigationInfo ajaxInfo = AjaxNavigationInfo.GetInfo(htmlHelper.ViewContext.HttpContext);
				if (ajaxInfo.PanelId == null)
					ajaxInfo.PanelId = id;
				html = content(null).ToHtmlString();
				if (ajaxInfo.PanelId == id)
				{
					ajaxInfo.Panels[id] = html;
					ajaxInfo.PanelId = null;
				}
			}
			TagBuilder tagBuilder = new TagBuilder("span");
			tagBuilder.MergeAttribute("id", id);
			tagBuilder.InnerHtml = html ?? content(null).ToHtmlString();
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));
		}

		private static bool NavigationDataChanged(HtmlHelper htmlHelper, string navigationDataKeys)
		{
			NavigationData data = (NavigationData)htmlHelper.ViewContext.HttpContext.Items["oldData"];
			if (data != null)
			{
				if (string.IsNullOrEmpty(navigationDataKeys))
					return true;
				foreach (string key in navigationDataKeys.Split(new char[] { ',' }))
				{
					if (!data[key.Trim()].Equals(StateContext.Data[key.Trim()]))
						return true;
				}
			}
			return false;
		}
	}
}
