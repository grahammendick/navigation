using System.Collections.Specialized;
using System.Text;
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
			string route = GetRoute(state, context);
			if (route != null)
			{
				RouteValueDictionary routeData = new RouteValueDictionary();
				foreach (string key in data.Keys)
				{
					if (key != NavigationSettings.Config.StateKey)
						routeData.Add(key, data[key]);
				}
				VirtualPathData virtualPath = RouteTable.Routes.GetVirtualPath(context.Request.RequestContext, route, routeData);
				if (virtualPath == null)
					return null;
				return virtualPath.VirtualPath;
			}
			else
			{
				StringBuilder href = new StringBuilder();
				href.Append(VirtualPathUtility.ToAbsolute(state.GetPage(context.GetOverriddenBrowser().IsMobileDevice), context.Request.ApplicationPath));
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

		public NameValueCollection GetNavigationData(State state, HttpContextBase context)
		{
			//Call from Mock Navigation and StateAdapter
			//Move GetQueryData logic into here
			return null;
		}

		protected virtual string GetRoute(State state, HttpContextBase context)
		{
			bool mobile = context.GetOverriddenBrowser().IsMobileDevice;
			if (state.GetRoute(mobile).Length == 0 || RouteTable.Routes[state.GetRouteName(mobile)] == null)
				return null;
			else
				return state.GetRouteName(mobile);
		}
	}
}
