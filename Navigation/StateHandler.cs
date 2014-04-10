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
		public string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			bool mobile = context != null && context.GetOverriddenBrowser().IsMobileDevice;
			string route = GetRoute(state, context);
			if (route != null)
			{
				RouteValueDictionary routeData = new RouteValueDictionary();
				foreach (string key in data.Keys)
				{
					if (key != NavigationSettings.Config.StateKey)
						routeData.Add(key, data[key]);
				}
				RequestContext requestContext = context != null ? null : new MockNavigationContext(null).Request.RequestContext;
				VirtualPathData virtualPath = RouteTable.Routes.GetVirtualPath(requestContext, route, routeData);
				if (virtualPath == null)
					return null;
				return virtualPath.VirtualPath;
			}
			else
			{
				StringBuilder href = new StringBuilder();
				string applicationPath = context != null ? context.Request.ApplicationPath : NavigationSettings.Config.ApplicationPath;
				href.Append(VirtualPathUtility.ToAbsolute(state.GetPage(mobile), applicationPath));
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

		public NameValueCollection GetNavigationData(State state, string navigationLink, HttpContextBase context)
		{
			//called from Mock Navigation - it's the reverse of GetNavigationLink so
			//could call it from StateAdapter if wanted?
			return null;
		}

		protected virtual string GetRoute(State state, HttpContextBase context)
		{
			bool mobile = context != null && context.GetOverriddenBrowser().IsMobileDevice;
			if (state.GetRoute(mobile).Length == 0 || RouteTable.Routes[state.GetRouteName(mobile)] == null)
				return null;
			else
				return state.GetRouteName(mobile);
		}
	}
}
