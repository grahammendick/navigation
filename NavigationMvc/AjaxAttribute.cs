using Newtonsoft.Json;
using System.IO;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public class AjaxAttribute : ActionFilterAttribute
	{
		public override void OnResultExecuting(ResultExecutingContext filterContext)
		{
			StringWriter dummyWriter = new StringWriter();
			TextWriter originalWriter = filterContext.HttpContext.Response.Output;
			filterContext.HttpContext.Items["originalWriter"] = originalWriter;
			if (filterContext.HttpContext.Request.Headers["navigation"] != null)
				filterContext.HttpContext.Response.Output = dummyWriter;
		}

		public override void OnResultExecuted(ResultExecutedContext filterContext)
		{
			if (filterContext.HttpContext.Request.Headers["navigation"] != null)
			{
				filterContext.HttpContext.Response.AppendHeader("Pragma", "no-cache");
				filterContext.HttpContext.Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
				filterContext.HttpContext.Response.AppendHeader("Expires", "0");
				filterContext.HttpContext.Response.Output = (TextWriter)filterContext.HttpContext.Items["originalWriter"];
				filterContext.HttpContext.Response.Write(JsonConvert.SerializeObject(AjaxNavigationInfo.GetInfo(filterContext.HttpContext).Panels));
			}
		}
	}
}
