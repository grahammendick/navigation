using System.Collections.Specialized;
using System.Web;
using System.Web.Routing;

namespace Navigation
{
	public class StateHandler : IStateHandler
	{
		public virtual string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			RouteValueDictionary routeData = new RouteValueDictionary();
			foreach (string key in data.Keys)
			{
				if (key != NavigationSettings.Config.StateKey)
					routeData.Add(key, data[key]);
			}
			VirtualPathData virtualPath = RouteTable.Routes.GetVirtualPath(context.Request.RequestContext, GetRoute(state, context), routeData);
			if (virtualPath == null)
				return null;
			return virtualPath.VirtualPath;
		}

		public virtual NameValueCollection GetNavigationData(State state, HttpContextBase context)
		{
			//Call from Mock Navigation and StateAdapter
			//Move GetQueryData logic into here
			return null;
		}

		protected virtual string GetRoute(State state, HttpContextBase context)
		{
			return state.Route;
		}
	}
}
