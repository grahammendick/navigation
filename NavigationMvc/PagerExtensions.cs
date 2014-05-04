using System.Globalization;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public static class PagerExtensions
	{
		public static MvcHtmlString Pager(this HtmlHelper htmlHelper)
		{
			return Pager(htmlHelper, "<<", "<", ">", ">>");
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string startRowIndexKey, string maximumRowsKey, string totalRowCountKey)
		{
			return Pager(htmlHelper, "<<", "<", ">", ">>", startRowIndexKey, maximumRowsKey, totalRowCountKey);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string firstPageText, string previousPageText, string nextPageText, string lastPageText)
		{
			return Pager(htmlHelper, firstPageText, previousPageText, nextPageText, lastPageText, "startRowIndex", "maximumRows", "totalRowCount");
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, string firstPageText, string previousPageText, string nextPageText, string lastPageText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey)
		{
			return GeneratePager(htmlHelper, null, previousPageText, nextPageText, firstPageText, lastPageText, startRowIndexKey, maximumRowsKey, totalRowCountKey);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks)
		{
			return Pager(htmlHelper, numberOfLinks, "...", "...");
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string startRowIndexKey, string maximumRowsKey, string totalRowCountKey)
		{
			return Pager(htmlHelper, numberOfLinks, "...", "...", startRowIndexKey, maximumRowsKey, totalRowCountKey);
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string previousPageText, string nextPageText)
		{
			return Pager(htmlHelper, numberOfLinks, previousPageText, nextPageText, "startRowIndex", "maximumRows", "totalRowCount");
		}

		public static MvcHtmlString Pager(this HtmlHelper htmlHelper, int numberOfLinks, string previousPageText, string nextPageText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey)
		{
			return GeneratePager(htmlHelper, numberOfLinks, previousPageText, nextPageText, null, null, startRowIndexKey, maximumRowsKey, totalRowCountKey);
		}

		private static MvcHtmlString GeneratePager(this HtmlHelper htmlHelper, int? numberOfLinks, 			
			string previousPageText, string nextPageText, string firstPageText, string lastPageText,
			string startRowIndexKey, string maximumRowsKey, string totalRowCountKey)
		{
			int startRowIndex = (int)StateContext.Data[startRowIndexKey];
			int maximumRows = (int)StateContext.Data[maximumRowsKey];
			int totalRowCount = (int)StateContext.Data[totalRowCountKey];
			StringBuilder pagerBuilder = new StringBuilder();
			if (numberOfLinks.HasValue)
			{
				AddNumericLinks(pagerBuilder, numberOfLinks.Value, startRowIndexKey, maximumRows, totalRowCount, "...", "...");
			}
			else
			{
				AddLink(pagerBuilder, firstPageText, 0, startRowIndexKey, totalRowCount);
				AddLink(pagerBuilder, previousPageText, startRowIndex - maximumRows, startRowIndexKey, totalRowCount);
				AddLink(pagerBuilder, nextPageText, startRowIndex + maximumRows, startRowIndexKey, totalRowCount);
				var remainder = totalRowCount % maximumRows;
				AddLink(pagerBuilder, lastPageText, remainder != 0 ? totalRowCount - remainder : totalRowCount - maximumRows, startRowIndexKey, totalRowCount);
			}
			TagBuilder tagBuilder = new TagBuilder("ul");
			tagBuilder.InnerHtml = pagerBuilder.ToString();
			return new MvcHtmlString(tagBuilder.ToString(TagRenderMode.Normal));
		}

		private static void AddNumericLinks(StringBuilder pagerBuilder, int numberOfLinks,
			string startRowIndexKey, int maximumRows, int totalRowCount,
			string previousPageText, string nextPageText)
		{
			int startRowIndex = (int)StateContext.Data[startRowIndexKey];
			int startNumberLink = startRowIndex / (numberOfLinks * maximumRows) * numberOfLinks;
			if (startNumberLink != 0)
				AddLink(pagerBuilder, previousPageText, (startNumberLink - 1) * maximumRows, startRowIndexKey, totalRowCount);
			int i = 0;
			while (i < numberOfLinks && totalRowCount > (i + startNumberLink) * maximumRows)
			{
				AddLink(pagerBuilder, (i + startNumberLink + 1).ToString(CultureInfo.InvariantCulture), (i + startNumberLink) * maximumRows, startRowIndexKey, totalRowCount);
				i++;
			}
			int nextRowIndex = (startNumberLink + numberOfLinks) * maximumRows;
			if (nextRowIndex < totalRowCount)
				AddLink(pagerBuilder, nextPageText, nextRowIndex, startRowIndexKey, totalRowCount);
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
