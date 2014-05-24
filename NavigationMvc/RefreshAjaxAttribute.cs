using Newtonsoft.Json;
using System;
using System.IO;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	/// <summary>
	/// Represents an attribute used to mark an action method capable of handling refresh
	/// ajax requests
	/// </summary>
	public class RefreshAjaxAttribute : ActionFilterAttribute
	{
		/// <summary>
		/// During a refresh ajax request the default output writing is replaced
		/// </summary>
		/// <param name="filterContext">The filter context</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="filterContext"/> is null</exception>
		public override void OnResultExecuting(ResultExecutingContext filterContext)
		{
			if (filterContext == null)
				throw new ArgumentNullException("filterContext");
			RefreshAjaxInfo info = RefreshAjaxInfo.GetInfo(filterContext.HttpContext);
			if (info.Data != null)
			{
				info.Writer = filterContext.HttpContext.Response.Output;
				filterContext.HttpContext.Response.Output = new StringWriter();
			}
		}

		/// <summary>
		/// During a refresh ajax request the updated panels are written as JSON
		/// </summary>
		/// <param name="filterContext">The filter context</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="filterContext"/> is null</exception>
		public override void OnResultExecuted(ResultExecutedContext filterContext)
		{
			if (filterContext == null)
				throw new ArgumentNullException("filterContext");
			RefreshAjaxInfo info = RefreshAjaxInfo.GetInfo(filterContext.HttpContext);
			if (info.Data != null)
			{
				filterContext.HttpContext.Response.Output = info.Writer;
				filterContext.HttpContext.Response.Write(JsonConvert.SerializeObject(info.Panels));
			}
		}
	}
}
