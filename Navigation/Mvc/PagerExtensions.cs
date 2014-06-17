using System;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Navigation
{
	/// <summary>
	/// Represents support for HTML in a navigation application
	/// </summary>
	public static class PagerExtensions
	{
		/// <summary>
		/// Returns an unordered list of anchor elements with href attributes set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new start row
		/// index
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An unordered list of anchor elements</returns>
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, object htmlAttributes = null)
		{
			return Pager(htmlHelper, "<<", "<", ">", ">>", htmlAttributes);
		}

		/// <summary>
		/// Returns an unordered list of anchor elements with href attributes set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new start row
		/// index
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="startRowIndexKey">The start row index <see cref="NavigationData"/> key</param>
		/// <param name="maximumRowsKey">The maximum rows <see cref="NavigationData"/> key</param>
		/// <param name="totalRowCountKey">The total row count <see cref="NavigationData"/> key</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An unordered list of anchor elements</returns>
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes = null)
		{
			return Pager(htmlHelper, "<<", "<", ">", ">>", startRowIndexKey, maximumRowsKey, totalRowCountKey, htmlAttributes);
		}

		/// <summary>
		/// Returns an unordered list of anchor elements with href attributes set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new start row
		/// index
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="firstText">The inner text of the first page anchor element</param>
		/// <param name="previousText">The inner text of the previous page anchor element</param>
		/// <param name="nextText">The inner text of the next page anchor element</param>
		/// <param name="lastText">The inner text of the last page anchor element</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An unordered list of anchor elements</returns>
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string firstText, string previousText, string nextText, string lastText, object htmlAttributes = null)
		{
			return Pager(htmlHelper, firstText, previousText, nextText, lastText, "startRowIndex", "maximumRows", "totalRowCount", htmlAttributes);
		}

		/// <summary>
		/// Returns an unordered list of anchor elements with href attributes set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new start row
		/// index
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="firstText">The inner text of the first page anchor element</param>
		/// <param name="previousText">The inner text of the previous page anchor element</param>
		/// <param name="nextText">The inner text of the next page anchor element</param>
		/// <param name="lastText">The inner text of the last page anchor element</param>
		/// <param name="startRowIndexKey">The start row index <see cref="NavigationData"/> key</param>
		/// <param name="maximumRowsKey">The maximum rows <see cref="NavigationData"/> key</param>
		/// <param name="totalRowCountKey">The total row count <see cref="NavigationData"/> key</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An unordered list of anchor elements</returns>
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string firstText, string previousText, string nextText, string lastText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes = null)
		{
			return GeneratePager(htmlHelper, null, previousText, nextText, firstText, lastText, startRowIndexKey, maximumRowsKey, totalRowCountKey, htmlAttributes);
		}

		/// <summary>
		/// Returns an unordered list of anchor elements with href attributes set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new start row
		/// index
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="numberOfLinks">The number of anchor elements to display</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An unordered list of anchor elements</returns>
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, object htmlAttributes = null)
		{
			return Pager(htmlHelper, numberOfLinks, "...", "...", htmlAttributes);
		}

		/// <summary>
		/// Returns an unordered list of anchor elements with href attributes set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new start row
		/// index
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="numberOfLinks">The number of anchor elements to display</param>
		/// <param name="startRowIndexKey">The start row index <see cref="NavigationData"/> key</param>
		/// <param name="maximumRowsKey">The maximum rows <see cref="NavigationData"/> key</param>
		/// <param name="totalRowCountKey">The total row count <see cref="NavigationData"/> key</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An unordered list of anchor elements</returns>
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes = null)
		{
			return Pager(htmlHelper, numberOfLinks, "...", "...", startRowIndexKey, maximumRowsKey, totalRowCountKey, htmlAttributes);
		}

		/// <summary>
		/// Returns an unordered list of anchor elements with href attributes set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new start row
		/// index
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="numberOfLinks">The number of anchor elements to display</param>
		/// <param name="previousText">The inner text of the previous pages anchor element</param>
		/// <param name="nextText">The inner text of the next pages anchor element</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An unordered list of anchor elements</returns>
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string previousText, string nextText, object htmlAttributes = null)
		{
			return Pager(htmlHelper, numberOfLinks, previousText, nextText, "startRowIndex", "maximumRows", "totalRowCount", htmlAttributes);
		}

		/// <summary>
		/// Returns an unordered list of anchor elements with href attributes set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new start row
		/// index
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="numberOfLinks">The number of anchor elements to display</param>
		/// <param name="previousText">The inner text of the previous pages anchor element</param>
		/// <param name="nextText">The inner text of the next pages anchor element</param>
		/// <param name="startRowIndexKey">The start row index <see cref="NavigationData"/> key</param>
		/// <param name="maximumRowsKey">The maximum rows <see cref="NavigationData"/> key</param>
		/// <param name="totalRowCountKey">The total row count <see cref="NavigationData"/> key</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An unordered list of anchor elements</returns>
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string previousText, string nextText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes = null)
		{
			return GeneratePager(htmlHelper, numberOfLinks, previousText, nextText, null, null, startRowIndexKey, maximumRowsKey, totalRowCountKey, htmlAttributes);
		}

		private static MvcHtmlString GeneratePager(this HtmlHelper htmlHelper, int? numberOfLinks, 			
			string previousText, string nextText, string firstText, string lastText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes)
		{
			int startRowIndex = (int)StateContext.Data[startRowIndexKey];
			int maximumRows = (int)StateContext.Data[maximumRowsKey];
			int totalRowCount = (int)StateContext.Data[totalRowCountKey];
			StringBuilder pagerBuilder = new StringBuilder();
			if (numberOfLinks.HasValue)
			{
				AddNumericLinks(htmlHelper, pagerBuilder, numberOfLinks.Value, startRowIndexKey, maximumRows, totalRowCount, previousText, nextText);
			}
			else
			{
				AddLink(htmlHelper, pagerBuilder, firstText, 0, startRowIndexKey, totalRowCount);
				AddLink(htmlHelper, pagerBuilder, previousText, startRowIndex - maximumRows, startRowIndexKey, totalRowCount);
				AddLink(htmlHelper, pagerBuilder, nextText, startRowIndex + maximumRows, startRowIndexKey, totalRowCount);
				var remainder = totalRowCount % maximumRows;
				AddLink(htmlHelper, pagerBuilder, lastText, remainder != 0 ? totalRowCount - remainder : totalRowCount - maximumRows, startRowIndexKey, totalRowCount);
			}
			if (pagerBuilder.Length == 0)
				return new MvcHtmlString(string.Empty);
			TagBuilder tagBuilder = new TagBuilder("ul");
			tagBuilder.InnerHtml = pagerBuilder.ToString();
			tagBuilder.MergeAttributes<string, object>(HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
			return new MvcHtmlString(tagBuilder.ToString(TagRenderMode.Normal));
		}

		private static void AddNumericLinks(this HtmlHelper htmlHelper, StringBuilder pagerBuilder, int numberOfLinks,
			string startRowIndexKey, int maximumRows, int totalRowCount,
			string previousText, string nextText)
		{
			int startRowIndex = (int)StateContext.Data[startRowIndexKey];
			int startNumberLink = startRowIndex / (numberOfLinks * maximumRows) * numberOfLinks;
			if (startNumberLink != 0)
				AddLink(htmlHelper, pagerBuilder, previousText, (startNumberLink - 1) * maximumRows, startRowIndexKey, totalRowCount);
			int i = 0;
			while (i < numberOfLinks && totalRowCount > (i + startNumberLink) * maximumRows)
			{
				AddLink(htmlHelper, pagerBuilder, (i + startNumberLink + 1).ToString(CultureInfo.InvariantCulture), (i + startNumberLink) * maximumRows, startRowIndexKey, totalRowCount);
				i++;
			}
			int nextRowIndex = (startNumberLink + numberOfLinks) * maximumRows;
			if (nextRowIndex < totalRowCount)
				AddLink(htmlHelper, pagerBuilder, nextText, nextRowIndex, startRowIndexKey, totalRowCount);
		}

		private static void AddLink(this HtmlHelper htmlHelper, StringBuilder pagerBuilder, string linkText, int newStartRowIndex, string startRowIndexKey, int totalRowCount)
		{
			int startRowIndex = (int)StateContext.Data[startRowIndexKey];
			TagBuilder tagBuilder;
			string itemHtml = HttpUtility.HtmlEncode(linkText);
			if (newStartRowIndex >= 0 && newStartRowIndex < totalRowCount && newStartRowIndex != startRowIndex)
			{
				NavigationData toData = new NavigationData(true);
				toData[startRowIndexKey] = newStartRowIndex;
				itemHtml = htmlHelper.RefreshLink(linkText, toData).ToString();
			}
			tagBuilder = new TagBuilder("li");
			tagBuilder.InnerHtml = itemHtml;
			pagerBuilder.Append(tagBuilder.ToString(TagRenderMode.Normal));
		}
	}
}
