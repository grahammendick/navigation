using Newtonsoft.Json;
using System.IO;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public class RefreshAjaxAttribute : ActionFilterAttribute
	{
		public override void OnResultExecuting(ResultExecutingContext filterContext)
		{
			RefreshAjaxInfo.GetInfo(filterContext.HttpContext).Writer = filterContext.HttpContext.Response.Output;
			if (RefreshAjaxInfo.GetInfo(filterContext.HttpContext).Data != null)
				filterContext.HttpContext.Response.Output = new StringWriter();
		}

		public override void OnResultExecuted(ResultExecutedContext filterContext)
		{
			RefreshAjaxInfo info = RefreshAjaxInfo.GetInfo(filterContext.HttpContext);
			if (info.Data != null)
			{
				filterContext.HttpContext.Response.AppendHeader("Pragma", "no-cache");
				filterContext.HttpContext.Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
				filterContext.HttpContext.Response.AppendHeader("Expires", "0");
				filterContext.HttpContext.Response.Output = info.Writer;
				filterContext.HttpContext.Response.Write(JsonConvert.SerializeObject(info.Panels));
			}
		}
	}
}
