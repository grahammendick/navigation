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
			filterContext.HttpContext.Response.Output = dummyWriter;
			base.OnResultExecuting(filterContext);
		}

		public override void OnResultExecuted(ResultExecutedContext filterContext)
		{
			//If in refresh post back, get the navigationpanels rendered content
			//Send that to the browser instead as json
			filterContext.HttpContext.Response.Output = (TextWriter) filterContext.HttpContext.Items["originalWriter"];
			filterContext.HttpContext.Response.Write(filterContext.HttpContext.Items["np1"]);
		}
	}
}
