using System;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	/// <summary>
	/// Represents support for HTML in a navigation application
	/// </summary>
	public static class SorterExtensions
	{
		/// <summary>
		/// Returns an anchor element (a element) with its href attribute set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new sort
		/// expression
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="linkText">The inner text of the anchor element</param>
		/// <param name="sortBy">The column name to sort by</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty or
		/// <paramref name="sortBy"/> is null or empty or</exception>
		public static MvcHtmlString Sorter(this HtmlHelper htmlHelper, string linkText, string sortBy)
		{
			return GenerateSorter(htmlHelper, linkText, sortBy, "sortExpression", false);
		}

		private static MvcHtmlString GenerateSorter(this HtmlHelper htmlHelper, string linkText, string sortBy, string sortExpressionKey, bool defaultDescending)
		{
			if (string.IsNullOrEmpty(linkText))
			{
				throw new ArgumentException(Resources.NullOrEmpty, "linkText");
			}
			if (string.IsNullOrEmpty(sortBy))
			{
				throw new ArgumentException(Resources.NullOrEmpty, "sortBy");
			}
			TagBuilder tagBuilder = new TagBuilder("a")
			{
				InnerHtml = HttpUtility.HtmlEncode(linkText)
			};
			NavigationData toData = new NavigationData(true);
			toData[sortExpressionKey] = GetSortExpression(sortBy, sortExpressionKey, defaultDescending);
			tagBuilder.MergeAttribute("href", StateController.GetRefreshLink(toData));
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));
		}

		private static SortDirection? GetDirection(string sortBy, string sortExpressionKey)
		{
			string sortExpression = (string) StateContext.Data[sortExpressionKey];
			if (sortExpression == sortBy)
				return SortDirection.Ascending;
			if (sortExpression == sortBy + " DESC")
				return SortDirection.Descending;
			return null;
		}

		private static string GetSortExpression(string sortBy, string sortExpressionKey, bool defaultDescending)
		{
			switch (GetDirection(sortBy, sortExpressionKey))
			{
				case (SortDirection.Ascending):
					return sortBy + " DESC";
				case (SortDirection.Descending):
					return sortBy;
				default:
					return !defaultDescending ? sortBy : sortBy + " DESC";
			}
		}
	}
}
