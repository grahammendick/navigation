using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace Navigation.Mvc
{
	/// <summary>
	/// Represents Navigation support for HTML in an application
	/// </summary>
	public static class FormExtensions
	{
		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetNavigationLink(string, NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="action">The key of a child <see cref="Transition"/> or the key of a 
		/// <see cref="Dialog"/></param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action)
		{
			return BeginNavigationForm(htmlHelper, action, null, null);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetNavigationLink(string, NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="action">The key of a child <see cref="Transition"/> or the key of a 
		/// <see cref="Dialog"/></param>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the next
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action, NavigationData toData)
		{
			return BeginNavigationForm(htmlHelper, action, toData, null);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetNavigationLink(string, NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="action">The key of a child <see cref="Transition"/> or the key of a 
		/// <see cref="Dialog"/></param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action, object htmlAttributes)
		{
			return BeginNavigationForm(htmlHelper, action, null, htmlAttributes);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetNavigationLink(string, NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="action">The key of a child <see cref="Transition"/> or the key of a 
		/// <see cref="Dialog"/></param>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the next
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action, NavigationData toData, object htmlAttributes)
		{
			return GenerateForm(htmlHelper, StateController.GetNavigationLink(action, toData), htmlAttributes);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetNavigationBackLink(int)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginNavigationBackForm(this HtmlHelper htmlHelper, int distance)
		{
			return BeginNavigationBackForm(htmlHelper, distance, null);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetNavigationBackLink(int)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginNavigationBackForm(this HtmlHelper htmlHelper, int distance, object htmlAttributes)
		{
			return GenerateForm(htmlHelper, StateController.GetNavigationBackLink(distance), htmlAttributes);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetRefreshLink(NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper)
		{
			return BeginRefreshForm(htmlHelper, null, null);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetRefreshLink(NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the current
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper, NavigationData toData)
		{
			return BeginRefreshForm(htmlHelper, toData, null);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetRefreshLink(NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper, object htmlAttributes)
		{
			return BeginRefreshForm(htmlHelper, null, htmlAttributes);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetRefreshLink(NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="toData">The <see cref="NavigationData"/> to be passed to the current
		/// <see cref="State"/> and stored in the <see cref="StateContext"/></param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper, NavigationData toData, object htmlAttributes)
		{
			return GenerateForm(htmlHelper, StateController.GetRefreshLink(toData), htmlAttributes);
		}

		private static MvcForm GenerateForm(this HtmlHelper htmlHelper, string url, object htmlAttributes)
		{
			TagBuilder tagBuilder = new TagBuilder("form");
			tagBuilder.MergeAttributes<string, object>(HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
			tagBuilder.MergeAttribute("action", url);
			tagBuilder.MergeAttribute("method", "post");
			htmlHelper.ViewContext.Writer.Write(tagBuilder.ToString(TagRenderMode.StartTag));
			return new MvcForm(htmlHelper.ViewContext);
		}
	}
}
