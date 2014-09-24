#if NET40Plus
using System;
using System.Web;
using System.Web.Script.Serialization;

namespace Navigation
{
	public class RefreshAjaxModule : IHttpModule
	{
		public void Init(HttpApplication context)
		{
			context.EndRequest += context_EndRequest;
		}

		private void context_EndRequest(object sender, EventArgs e)
		{
			var context = (HttpApplication) sender;
			var response = context.Response;
			var info = RefreshAjaxInfo.GetInfo(new HttpContextWrapper(context.Context));
			if (response.StatusCode == 302 && info.Data != null)
			{
				var link = response.RedirectLocation;
				response.RedirectLocation = null;
				response.ClearContent();
				response.StatusCode = 200;
				response.Write(new JavaScriptSerializer().Serialize(new
					{
						RedirectLink = link
					}));
			}
		}

		public void Dispose()
		{
		}
	}
}
#endif