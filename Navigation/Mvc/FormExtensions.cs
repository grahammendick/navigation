using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace Navigation
{
	/// <summary>
	/// Represents support for HTML in a navigation application
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
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Transition"/> or the key of a <see cref="Dialog"/>; or there is 
		/// <see cref="NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action, object htmlAttributes = null)
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
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Transition"/> or the key of a <see cref="Dialog"/>; or there is 
		/// <see cref="NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static MvcForm BeginNavigationForm(this HtmlHelper htmlHelper, string action, NavigationData toData, object htmlAttributes = null)
		{
			return GenerateForm(htmlHelper, StateController.GetNavigationLink(action, toData), htmlAttributes);
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
		/// <exception cref="System.ArgumentException"><see cref="StateController.CanNavigateBack"/> returns
		/// false for this <paramref name="distance"/></exception>
		public static MvcForm BeginNavigationBackForm(this HtmlHelper htmlHelper, int distance, object htmlAttributes = null)
		{
			return GenerateForm(htmlHelper, StateController.GetNavigationBackLink(distance), htmlAttributes);
		}

		/// <summary>
		/// Writes an opening &lt;form&gt; tag to the response with its action attribute set from
		/// a call to <see cref="StateController.GetRefreshLink(NavigationData)"/>
		/// </summary>
		/// <param name="htmlHelper">The HTML helper instance that this method extends</param>
		/// <param name="htmlAttributes">An object that contains the HTML attributes to set for the
		/// element</param>
		/// <returns>An opening &lt;form&gt; tag</returns>
		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper, object htmlAttributes = null)
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
		/// <exception cref="System.ArgumentException">There is <see cref="NavigationData"/> that cannot be
		/// converted to a <see cref="System.String"/></exception>
		public static MvcForm BeginRefreshForm(this HtmlHelper htmlHelper, NavigationData toData, object htmlAttributes = null)
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
