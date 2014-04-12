using System.Collections.Specialized;
using System.Text;
using System.Web;
using System.Web.Routing;
using System.Web.WebPages;

namespace Navigation
{
	public class PageStateHandler : StateHandler
	{
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

		protected override string GetRoute(State state, HttpContextBase context)
		{
			bool mobile = context.GetOverriddenBrowser().IsMobileDevice;
			if (state.GetRoute(mobile).Length == 0 || RouteTable.Routes[state.GetRouteName(mobile)] == null)
				return null;
			else
				return state.GetRouteName(mobile);
		}
	}
}
