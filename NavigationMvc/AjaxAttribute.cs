using Newtonsoft.Json;
using System.Globalization;
using System.IO;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public class AjaxAttribute : ActionFilterAttribute
	{
		public override void OnResultExecuting(ResultExecutingContext filterContext)
		{
			//Check if we're in refresh post back mode
			//if so replace the current writer with an empty one (see onactionexecuting of outputcacheattribute)
			StringWriter dummyWriter = new StringWriter();
			TextWriter originalWriter = filterContext.HttpContext.Response.Output;
			filterContext.HttpContext.Items["originalWriter"] = originalWriter;
			if (filterContext.HttpContext.Request.Headers["navigation"] != null)
				filterContext.HttpContext.Response.Output = dummyWriter;
		}

		public override void OnResultExecuted(ResultExecutedContext filterContext)
		{
			//If in refresh post back, get the navigationpanels rendered content
			//Send that to the browser instead as json
			if (filterContext.HttpContext.Request.Headers["navigation"] != null)
			{
				filterContext.HttpContext.Response.AppendHeader("Pragma", "no-cache");
				filterContext.HttpContext.Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
				filterContext.HttpContext.Response.AppendHeader("Expires", "0");
				filterContext.HttpContext.Response.Output = (TextWriter)filterContext.HttpContext.Items["originalWriter"];
				filterContext.HttpContext.Response.Write(JsonConvert.SerializeObject(filterContext.HttpContext.Items["panels"]));
			}
		}
	}
}
