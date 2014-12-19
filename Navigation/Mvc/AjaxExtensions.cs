#if NET40Plus
using System;
using System.Web.Mvc;
using System.Web.WebPages;

namespace Navigation
{
	/// <summary>
	/// Represents support for AJAX in a navigation application
	/// </summary>
	public static class AjaxExtensions
	{
		/// <summary>
		/// Returns a span element containing the specified <paramref name="content"/>
		/// </summary>
		/// <param name="ajaxHelper">The AJAX helper instance that this method extends</param>
		/// <param name="id">The span element id</param>
		/// <param name="navigationDataKeys">Comma separated list of <see cref="NavigationData"/>
		/// items that trigger the panel to refresh</param>
		/// <param name="content">Html content</param>
		/// <returns>A span container element</returns>
		public static MvcHtmlString RefreshPanel(this AjaxHelper ajaxHelper, string id, string navigationDataKeys, Func<dynamic, HelperResult> content)
		{
			return RefreshPanel(ajaxHelper, id, NavigationDataChanged(navigationDataKeys), content);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="ajaxHelper"></param>
		/// <param name="id"></param>
		/// <param name="changed"></param>
		/// <param name="content"></param>
		/// <returns></returns>
		public static MvcHtmlString RefreshPanel(this AjaxHelper ajaxHelper, string id, Func<NavigationData, NavigationData, bool> changed, Func<dynamic, HelperResult> content)
		{
			string html = null;
			var fromData = RefreshAjaxInfo.GetInfo(ajaxHelper.ViewContext.HttpContext).Data;
			if (fromData != null && changed(fromData, StateContext.Data))
			{
				RefreshAjaxInfo info = RefreshAjaxInfo.GetInfo(ajaxHelper.ViewContext.HttpContext);
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

		private static Func<NavigationData, NavigationData, bool> NavigationDataChanged(string navigationDataKeys)
		{
			return (fromData, toData) =>
				{
					if (string.IsNullOrEmpty(navigationDataKeys))
						return true;
					foreach (string key in navigationDataKeys.Split(new char[] { ',' }))
					{
						if ((fromData[key.Trim()] == null && toData[key.Trim()] != null)
							|| (fromData[key.Trim()] != null && !fromData[key.Trim()].Equals(toData[key.Trim()])))
							return true;
					}
					return false;
				};
		}
	}
}
#endif
