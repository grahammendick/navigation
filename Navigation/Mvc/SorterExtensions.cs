#if NET40Plus
using System;
using System.Web;
using System.Web.Mvc;

namespace Navigation
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
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty or
		/// <paramref name="sortBy"/> is null or empty</exception>
		public static MvcHtmlString Sorter(this HtmlHelper htmlHelper, string linkText, string sortBy, object htmlAttributes = null)
		{
			return Sorter(htmlHelper, linkText, sortBy, "sortExpression", htmlAttributes);
		}

		/// <summary>
		/// Returns an anchor element (a element) with its href attribute set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/> passing the new sort
		/// expression
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="linkText">The inner text of the anchor element</param>
		/// <param name="sortBy">The column name to sort by</param>
		/// <param name="sortExpressionKey">The sort expression <see cref="NavigationData"/> key</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty or
		/// <paramref name="sortBy"/> is null or empty</exception>
		public static MvcHtmlString Sorter(this HtmlHelper htmlHelper, string linkText, string sortBy, string sortExpressionKey, object htmlAttributes = null)
		{
			return GenerateSorter(htmlHelper, linkText, sortBy, sortExpressionKey, htmlAttributes);
		}

		private static MvcHtmlString GenerateSorter(this HtmlHelper htmlHelper, string linkText, string sortBy, string sortExpressionKey, object htmlAttributes)
		{
			if (string.IsNullOrEmpty(linkText))
				throw new ArgumentException(Resources.NullOrEmpty, "linkText");
			if (string.IsNullOrEmpty(sortBy))
				throw new ArgumentException(Resources.NullOrEmpty, "sortBy");
			string sortExpression = (string)StateContext.Data[sortExpressionKey];
			if (sortExpression != sortBy + " DESC")
				sortExpression = sortBy + " DESC";
			else
				sortExpression = sortBy;
			NavigationData toData = new NavigationData();
			toData[sortExpressionKey] = sortExpression;
			return htmlHelper.RefreshLink(linkText, toData, true, htmlAttributes);
		}
	}
}
#endif
