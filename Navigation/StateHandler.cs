using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Routing;
using System.Web.WebPages;

namespace Navigation
{
	/// <summary>
	/// 
	/// </summary>
	public class StateHandler : IStateHandler
	{
		private bool Mobile
		{
			get
			{
				return HttpContext.Current != null && new HttpContextWrapper(HttpContext.Current).GetOverriddenBrowser().IsMobileDevice;
			}
		}

		public string GetNavigationLink(State state, NameValueCollection data)
		{
			string route = GetRoute(state);
			if (route != null)
			{
				RouteValueDictionary routeData = new RouteValueDictionary();
				foreach (string key in data.Keys)
				{
					if (key != NavigationSettings.Config.StateKey)
						routeData.Add(key, data[key]);
				}
				RequestContext context = HttpContext.Current != null ? null : new MockNavigationContext(null).Request.RequestContext;
				VirtualPathData virtualPath = RouteTable.Routes.GetVirtualPath(context, route, routeData);
				if (virtualPath == null)
					return null;
				return virtualPath.VirtualPath;
			}
			else
			{
				StringBuilder href = new StringBuilder();
				string applicationPath = HttpContext.Current != null ? HttpContext.Current.Request.ApplicationPath : NavigationSettings.Config.ApplicationPath;
				href.Append(VirtualPathUtility.ToAbsolute(state.GetPage(Mobile), applicationPath));
				href.Append("?");
				href.Append(HttpUtility.UrlEncode(NavigationSettings.Config.StateKey));
				href.Append("=");
				href.Append(HttpUtility.UrlEncode(state.DialogStateKey));
				foreach (string key in data)
				{
					if (key != NavigationSettings.Config.StateKey)
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

		protected virtual string GetRoute(State state)
		{
			bool mobile = HttpContext.Current != null && new HttpContextWrapper(HttpContext.Current).GetOverriddenBrowser().IsMobileDevice;
			if (state.GetRoute(Mobile).Length == 0 || RouteTable.Routes[state.GetRouteName(Mobile)] == null)
				return null;
			else
				return state.GetRouteName(mobile);
		}
	}
}
