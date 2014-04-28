using System;
using System.Web;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	/// <summary>
	/// Represents support for HTML in a Navigation application
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
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty;
		/// <paramref name="action"/> does not match the key of a child <see cref="Transition"/> or 
		/// the key of a <see cref="Dialog"/>; or there is <see cref="NavigationData"/> that cannot 
		/// be converted to a <see cref="System.String"/></exception>
		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action)
		{
			return NavigationLink(htmlHelper, linkText, action, null, null);
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
		/// <returns>An anchor element (a element)</returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="linkText"/> is null or empty;
		/// <paramref name="action"/> does not match the key of a child <see cref="Transition"/> or 
		/// the key of a <see cref="Dialog"/>; or there is <see cref="NavigationData"/> that cannot 
		/// be converted to a <see cref="System.String"/></exception>
		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, NavigationData toData)
		{
			return NavigationLink(htmlHelper, linkText, action, toData, null);
		}

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
		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, object htmlAttributes)
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
		public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string action, NavigationData toData, object htmlAttributes)
		{
			return GenerateLink(htmlHelper, linkText, StateController.GetNavigationLink(action, toData), htmlAttributes);
		}

		public static MvcHtmlString NavigationBackLink(this HtmlHelper htmlHelper, string linkText, int distance)
		{
			return NavigationBackLink(htmlHelper, linkText, distance, null);
		}

		public static MvcHtmlString NavigationBackLink(this HtmlHelper htmlHelper, string linkText, int distance, object htmlAttributes)
		{
			return GenerateLink(htmlHelper, linkText, StateController.GetNavigationBackLink(distance), htmlAttributes);
		}

		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText)
		{
			return RefreshLink(htmlHelper, linkText, null, null);
		}

		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, NavigationData toData)
		{
			return RefreshLink(htmlHelper, linkText, toData, null);
		}

		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, object htmlAttributes)
		{
			return RefreshLink(htmlHelper, linkText, null, htmlAttributes);
		}

		public static MvcHtmlString RefreshLink(this HtmlHelper htmlHelper, string linkText, NavigationData toData, object htmlAttributes)
		{
			return GenerateLink(htmlHelper, linkText, StateController.GetRefreshLink(toData), htmlAttributes);
		}

		private static MvcHtmlString GenerateLink(this HtmlHelper htmlHelper, string linkText, string url, object htmlAttributes)
		{
			if (string.IsNullOrEmpty(linkText))
			{
				throw new ArgumentException(Resources.NullOrEmpty, "linkText");
			}
			TagBuilder tagBuilder = new TagBuilder("a")
			{
				InnerHtml = HttpUtility.HtmlEncode(linkText)
			};
			tagBuilder.MergeAttributes<string, object>(HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
			tagBuilder.MergeAttribute("href", url);
			return MvcHtmlString.Create(tagBuilder.ToString(TagRenderMode.Normal));

		}
	}
}
