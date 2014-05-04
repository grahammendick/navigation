using System;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public static class PagerExtensions
	{
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, object htmlAttributes = null)
		{
			return Pager(htmlHelper, "<<", "<", ">", ">>", htmlAttributes);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes = null)
		{
			return Pager(htmlHelper, "<<", "<", ">", ">>", startRowIndexKey, maximumRowsKey, totalRowCountKey, htmlAttributes);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string firstText, string previousText, string nextText, string lastText, object htmlAttributes = null)
		{
			return Pager(htmlHelper, firstText, previousText, nextText, lastText, "startRowIndex", "maximumRows", "totalRowCount", htmlAttributes);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string firstText, string previousText, string nextText, string lastText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes = null)
		{
			return GeneratePager(htmlHelper, null, previousText, nextText, firstText, lastText, startRowIndexKey, maximumRowsKey, totalRowCountKey, htmlAttributes);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, object htmlAttributes = null)
		{
			return Pager(htmlHelper, numberOfLinks, "...", "...", htmlAttributes);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes = null)
		{
			return Pager(htmlHelper, numberOfLinks, "...", "...", startRowIndexKey, maximumRowsKey, totalRowCountKey, htmlAttributes);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string previousText, string nextText, object htmlAttributes = null)
		{
			return Pager(htmlHelper, numberOfLinks, previousText, nextText, "startRowIndex", "maximumRows", "totalRowCount", htmlAttributes);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string previousText, string nextText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes = null)
		{
			return GeneratePager(htmlHelper, numberOfLinks, previousText, nextText, null, null, startRowIndexKey, maximumRowsKey, totalRowCountKey, htmlAttributes);
		}

		private static MvcHtmlString GeneratePager(this HtmlHelper htmlHelper, int? numberOfLinks, 			
			string previousText, string nextText, string firstText, string lastText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey, object htmlAttributes)
		{
			if (StateContext.Data[startRowIndexKey] as int? == null)
				throw new ArgumentException(Resources.InvalidPagerValue, startRowIndexKey);
			if (StateContext.Data[maximumRowsKey] as int? == null)
				throw new ArgumentException(Resources.InvalidPagerValue, maximumRowsKey);
			if (StateContext.Data[totalRowCountKey] as int? == null)
				throw new ArgumentException(Resources.InvalidPagerValue, totalRowCountKey);
			int startRowIndex = (int)StateContext.Data[startRowIndexKey];
			int maximumRows = (int)StateContext.Data[maximumRowsKey];
			int totalRowCount = (int)StateContext.Data[totalRowCountKey];
			if (totalRowCount == 0)
				return new MvcHtmlString(string.Empty);
			StringBuilder pagerBuilder = new StringBuilder();
			if (numberOfLinks.HasValue)
			{
				AddNumericLinks(pagerBuilder, numberOfLinks.Value, startRowIndexKey, maximumRows, totalRowCount, previousText, nextText);
			}
			else
			{
				AddLink(pagerBuilder, firstText, 0, startRowIndexKey, totalRowCount);
				AddLink(pagerBuilder, previousText, startRowIndex - maximumRows, startRowIndexKey, totalRowCount);
				AddLink(pagerBuilder, nextText, startRowIndex + maximumRows, startRowIndexKey, totalRowCount);
				var remainder = totalRowCount % maximumRows;
				AddLink(pagerBuilder, lastText, remainder != 0 ? totalRowCount - remainder : totalRowCount - maximumRows, startRowIndexKey, totalRowCount);
			}
			TagBuilder tagBuilder = new TagBuilder("ul");
			tagBuilder.InnerHtml = pagerBuilder.ToString();
			tagBuilder.MergeAttributes<string, object>(HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
			return new MvcHtmlString(tagBuilder.ToString(TagRenderMode.Normal));
		}

		private static void AddNumericLinks(StringBuilder pagerBuilder, int numberOfLinks,
			string startRowIndexKey, int maximumRows, int totalRowCount,
			string previousText, string nextText)
		{
			int startRowIndex = (int)StateContext.Data[startRowIndexKey];
			int startNumberLink = startRowIndex / (numberOfLinks * maximumRows) * numberOfLinks;
			if (startNumberLink != 0)
				AddLink(pagerBuilder, previousText, (startNumberLink - 1) * maximumRows, startRowIndexKey, totalRowCount);
			int i = 0;
			while (i < numberOfLinks && totalRowCount > (i + startNumberLink) * maximumRows)
			{
				AddLink(pagerBuilder, (i + startNumberLink + 1).ToString(CultureInfo.InvariantCulture), (i + startNumberLink) * maximumRows, startRowIndexKey, totalRowCount);
				i++;
			}
			int nextRowIndex = (startNumberLink + numberOfLinks) * maximumRows;
			if (nextRowIndex < totalRowCount)
				AddLink(pagerBuilder, nextText, nextRowIndex, startRowIndexKey, totalRowCount);
		}

		private static void AddLink(StringBuilder pagerBuilder, string linkText, int newStartRowIndex, string startRowIndexKey, int totalRowCount)
		{
			int startRowIndex = (int)StateContext.Data[startRowIndexKey];
			TagBuilder tagBuilder;
			string itemHtml = HttpUtility.HtmlEncode(linkText);
			if (newStartRowIndex >= 0 && newStartRowIndex < totalRowCount && newStartRowIndex != startRowIndex)
			{
				tagBuilder = new TagBuilder("a");
				tagBuilder.InnerHtml = itemHtml;
				NavigationData toData = new NavigationData(true);
				toData[startRowIndexKey] = newStartRowIndex;
				tagBuilder.MergeAttribute("href", StateController.GetRefreshLink(toData));
				itemHtml = tagBuilder.ToString(TagRenderMode.Normal);
			}
			tagBuilder = new TagBuilder("li");
			tagBuilder.InnerHtml = itemHtml;
			pagerBuilder.Append(tagBuilder.ToString(TagRenderMode.Normal));
		}
	}
}
