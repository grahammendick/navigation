using System;
using System.IO;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Navigation
{
	/// <summary>
	/// Represents an attribute used to mark an action method capable of handling refresh
	/// ajax requests
	/// </summary>
	public class RefreshAjaxAttribute : ActionFilterAttribute
	{
		/// <summary>
		/// Responds to a refresh ajax request by overriding the default output writing
		/// </summary>
		/// <param name="filterContext">The filter context</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="filterContext"/> is null</exception>
		public override void OnResultExecuting(ResultExecutingContext filterContext)
		{
			if (filterContext == null)
				throw new ArgumentNullException("filterContext");
			RefreshAjaxInfo info = RefreshAjaxInfo.GetInfo(filterContext.HttpContext);
			if (!filterContext.IsChildAction && info.Data != null)
			{
				info.Writer = filterContext.HttpContext.Response.Output;
				filterContext.HttpContext.Response.Output = new StringWriter();
			}
		}

		/// <summary>
		/// Responds to a refresh ajax request by writing the updated panel content as JSON
		/// </summary>
		/// <param name="filterContext">The filter context</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="filterContext"/> is null</exception>
		public override void OnResultExecuted(ResultExecutedContext filterContext)
		{
			if (filterContext == null)
				throw new ArgumentNullException("filterContext");
			RefreshAjaxInfo info = RefreshAjaxInfo.GetInfo(filterContext.HttpContext);
			if (!filterContext.IsChildAction && info.Data != null)
			{
				filterContext.HttpContext.Response.AppendHeader("Pragma", "no-cache");
				filterContext.HttpContext.Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
				filterContext.HttpContext.Response.AppendHeader("Expires", "0");
				filterContext.HttpContext.Response.Output = info.Writer;
				filterContext.HttpContext.Response.Write(new JavaScriptSerializer().Serialize(info.Panels));
			}
		}
	}
}
