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
			NameValueCollection queryData = new NameValueCollection();
			foreach (string key in context.Request.RequestContext.RouteData.DataTokens.Keys)
			{
				queryData.Add(key, (string)context.Request.RequestContext.RouteData.DataTokens[key]);
			}
			foreach (string key in context.Request.RequestContext.RouteData.Values.Keys)
			{
				if (context.Request.RequestContext.RouteData.Values[key] != null)
				{
					queryData.Add(key, (string)context.Request.RequestContext.RouteData.Values[key]);
				}
			}
			foreach (string key in context.Request.QueryString)
			{
				queryData.Add(key, context.Request.QueryString[key]);
			}
			return queryData;
		}

		protected virtual string GetRoute(State state, HttpContextBase context)
		{
			return state.Route;
		}
	}
}
