#if NET40Plus
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Navigation
{
	/// <summary>
	/// Represents support for HTML in a navigation application
	/// </summary>
	public static class LinkExtensions
	{
		/// <summary>
		/// Returns an anchor element (a element) with its href attribute set from a call to
		/// <see cref="StateController.GetNavigationLink(string, NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="linkText">The inner text of the anchor element</param>
		/// <param name="action">The key of a child <see cref="Transition"/> or the key of a 
		/// <see cref="Dialog"/></param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty;
		/// <paramref name="action"/> does not match the key of a child <see cref="Transition"/> or 
		/// the key of a <see cref="Dialog"/>; or there is <see cref="NavigationData"/> that cannot 
		/// be converted to a <see cref="System.String"/></exception>
		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, object htmlAttributes = null)
		{
			return NavigationLink(htmlHelper, linkText, action, null, htmlAttributes);
		}

		/// <summary>
		/// Returns an anchor element (a element) with its href attribute set from a call to
		/// <see cref="StateController.GetNavigationLink(string, NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="linkText">The inner text of the anchor element</param>
		/// <param name="action">The key of a child <see cref="Transition"/> or the key of a 
		/// <see cref="Dialog"/></param>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the next
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty;
		/// <paramref name="action"/> does not match the key of a child <see cref="Transition"/> or 
		/// the key of a <see cref="Dialog"/>; or there is <see cref="NavigationData"/> that cannot 
		/// be converted to a <see cref="System.String"/></exception>
		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, NavigationData toData, object htmlAttributes = null)
		{
			return GenerateLink(htmlHelper, linkText, StateController.GetNavigationLink(action, toData), htmlAttributes);
		}

		/// <summary>
		/// Returns an anchor element (a element) with its href attribute set from a call to
		/// <see cref="StateController.GetNavigationBackLink(int)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="linkText">The inner text of the anchor element</param>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty; or
		/// <see cref="StateController.CanNavigateBack"/> returns false for this <paramref name="distance"/></exception>
		public static MvcHtmlString NavigationBackLink(this HtmlHelper htmlHelper, string linkText, int distance, object htmlAttributes = null)
		{
			return GenerateLink(htmlHelper, linkText, StateController.GetNavigationBackLink(distance), htmlAttributes);
		}

		/// <summary>
		/// Returns an anchor element (a element) with its href attribute set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="linkText">The inner text of the anchor element</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty</exception>
		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, object htmlAttributes = null)
		{
			return RefreshLink(htmlHelper, linkText, null, false, htmlAttributes);
		}

		/// <summary>
		/// Returns an anchor element (a element) with its href attribute set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="linkText">The inner text of the anchor element</param>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the current
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		/// <param name="includeCurrentData">Indicates whether to include the current data together
		/// with the <paramref name="toData"/></param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty; or
		/// there is <see cref="NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, NavigationData toData, bool includeCurrentData = false, object htmlAttributes = null)
		{
			var data = new NavigationData(includeCurrentData);
			if (toData != null)
				data.Add(toData);
			var currentKeys = htmlHelper.GetCurrentKeys(includeCurrentData, toData);
			return GenerateLink(htmlHelper, linkText, StateController.GetRefreshLink(data), htmlAttributes, true, includeCurrentData, string.Join(",", currentKeys));
		}

		/// <summary>
		/// Returns an anchor element (a element) with its href attribute set from a call to
		/// <see cref="StateController.GetRefreshLink(NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="linkText">The inner text of the anchor element</param>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the current
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		/// <param name="currentDataKeys">A comma separated list of current data items to
		/// include together with the <paramref name="toData"/></param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty; or
		/// there is <see cref="NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, NavigationData toData, string currentDataKeys, object htmlAttributes = null)
		{
			var currentKeys = htmlHelper.GetCurrentKeys(currentDataKeys);
			var data = new NavigationData(currentKeys);
			if (toData != null)
				data.Add(toData);
			return GenerateLink(htmlHelper, linkText, StateController.GetRefreshLink(data), htmlAttributes, true, false, string.Join(",", currentKeys));
		}

		private static MvcHtmlString GenerateLink(this HtmlHelper htmlHelper, string linkText, string url, object htmlAttributes,
			bool refresh = false, bool includeCurrentData = false, string currentDataKeys = null)
		{
			if (string.IsNullOrEmpty(linkText))
				throw new ArgumentException(Resources.NullOrEmpty, "linkText");
			TagBuilder tagBuilder = new TagBuilder("a");
			tagBuilder.InnerHtml = HttpUtility.HtmlEncode(linkText);
			tagBuilder.MergeAttributes<string, object>(HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
			tagBuilder.MergeAttribute("href", url);
			if (refresh)
				tagBuilder.MergeAttribute("data-navigation", "refresh");
			if (includeCurrentData)
				tagBuilder.MergeAttribute("data-include-current", "true");
			if (currentDataKeys != null && currentDataKeys.Length != 0)
				tagBuilder.MergeAttribute("data-current-keys", currentDataKeys);
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));
		}

		internal static IEnumerable<string> GetCurrentKeys(this HtmlHelper htmlHelper, bool includeCurrentData, NavigationData toData)
		{
			if (includeCurrentData && toData != null)
			{
				foreach (NavigationDataItem item in toData)
				{
					if (item.Value.Equals(string.Empty) || item.Value.Equals(StateContext.State.Defaults[item.Key]))
						yield return item.Key;
				}
			}
		}

		internal static IEnumerable<string> GetCurrentKeys(this HtmlHelper htmlHelper, string currentDataKeys)
		{
			if (currentDataKeys != null && currentDataKeys.Length != 0)
			{
				foreach (string key in currentDataKeys.Split(','))
				{
					yield return key.Trim();
				}
			}
		}
	}
}
#endif
