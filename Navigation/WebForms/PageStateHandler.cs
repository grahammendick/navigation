using System.Collections.Specialized;
using System.Text;
using System.Web;
#if NET40Plus
using System.Web.Routing;
using System.Web.WebPages;
#endif
namespace Navigation
{
	public class PageStateHandler : StateHandler
	{
#if NET40Plus
		public override string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			if (GetRoute(state, context) != null)
			{
				return base.GetNavigationLink(state, data, context);
			}
			else
			{
				StringBuilder href = new StringBuilder();
				href.Append(VirtualPathUtility.ToAbsolute(state.GetPage(context.GetOverriddenBrowser().IsMobileDevice), context.Request.ApplicationPath));
				href.Append("?");
				href.Append(HttpUtility.UrlEncode(NavigationSettings.Config.StateIdKey));
				href.Append("=");
				href.Append(HttpUtility.UrlEncode(state.Id));
				foreach (string key in data)
				{
					if (key != NavigationSettings.Config.StateIdKey)
					{
						href.Append("&");
						href.Append(HttpUtility.UrlEncode(key));
						href.Append("=");
						href.Append(HttpUtility.UrlEncode(data[key]));
					}
				}
				return href.ToString();
			}
		}

		protected override string GetRoute(State state, HttpContextBase context)
		{
			bool mobile = context.GetOverriddenBrowser().IsMobileDevice;
			if (state.GetRoute(mobile).Length == 0 || RouteTable.Routes[state.GetRouteName(mobile)] == null)
				return null;
			else
				return state.GetRouteName(mobile);
		}
#else
		public override string GetNavigationLink(State state, NameValueCollection data, HttpContext context)
		{
			bool mobile = HttpContext.Current != null && HttpContext.Current.Request.Browser.IsMobileDevice;
			string applicationPath = HttpContext.Current != null ? HttpContext.Current.Request.ApplicationPath : NavigationSettings.Config.ApplicationPath;
			return GetLink(state, data, mobile, applicationPath);
		}

		public override NameValueCollection GetNavigationData(State state, HttpContext context)
		{
			NameValueCollection queryData = new NameValueCollection();
			foreach (string key in context.Request.QueryString)
			{
				queryData.Add(key, context.Request.QueryString[key]);
			}
			return queryData;
		}
#endif
		private string GetLink(State state, NameValueCollection data, bool mobile, string applicationPath)
		{
			StringBuilder link = new StringBuilder();
			link.Append(VirtualPathUtility.ToAbsolute(state.GetPage(mobile), applicationPath));
			link.Append("?");
			link.Append(HttpUtility.UrlEncode(NavigationSettings.Config.StateIdKey));
			link.Append("=");
			link.Append(HttpUtility.UrlEncode(state.Id));
			foreach (string key in data)
			{
				if (key != NavigationSettings.Config.StateIdKey)
				{
					link.Append("&");
					link.Append(HttpUtility.UrlEncode(key));
					link.Append("=");
					link.Append(HttpUtility.UrlEncode(data[key]));
				}
			}
			return link.ToString();
		}
	}
}
