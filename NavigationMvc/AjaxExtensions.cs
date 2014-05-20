using System;
using System.Web.Mvc;
using System.Web.WebPages;

namespace Navigation.Mvc
{
	public static class AjaxExtensions
	{
		public static MvcHtmlString RefreshAjaxPanel(this HtmlHelper htmlHelper, string id, string navigationDataKeys, Func<dynamic, HelperResult> content)
		{
			string html = null;
			if (NavigationDataChanged(htmlHelper, navigationDataKeys))
			{
				RefreshAjaxInfo info = RefreshAjaxInfo.GetInfo(htmlHelper.ViewContext.HttpContext);
				if (info.PanelId == null)
					info.PanelId = id;
				html = content(null).ToHtmlString();
				if (info.PanelId == id)
				{
					info.Panels[id] = html;
					info.PanelId = null;
				}
			}
			TagBuilder tagBuilder = new TagBuilder("span");
			tagBuilder.MergeAttribute("id", id);
			tagBuilder.InnerHtml = html ?? content(null).ToHtmlString();
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));
		}

		private static bool NavigationDataChanged(HtmlHelper htmlHelper, string navigationDataKeys)
		{
			NavigationData data = RefreshAjaxInfo.GetInfo(htmlHelper.ViewContext.HttpContext).Data;
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
