#if NET40Plus
using System;
using System.Web;
using System.Web.Script.Serialization;

namespace Navigation
{
	/// <summary>
	/// Converts 302 redirects during refresh ajax navigation into 200s
	/// so the redirection can happen on the client
	/// </summary>
	public class RefreshAjaxModule : IHttpModule
	{
		/// <summary>
		/// Initializes request handlers
		/// </summary>
		/// <param name="context">An <see cref="System.Web.HttpApplication"/> that 
		/// provides access to the methods, properties and events common to all 
		/// application objects within an ASP.NET application</param>
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

		/// <summary>
		/// Disposes of any resources
		/// </summary>
		public void Dispose()
		{
		}
	}
}
#endif