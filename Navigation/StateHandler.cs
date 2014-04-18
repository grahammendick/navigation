using System.Collections.Specialized;
using System.Web;
#if NET40Plus
using System.Web.Routing;
#endif

namespace Navigation
{
	public class StateHandler : IStateHandler
	{
#if NET40Plus
		public virtual string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			RouteValueDictionary routeData = new RouteValueDictionary();
			foreach (string key in data.Keys)
			{
				if (key != NavigationSettings.Config.StateIdKey)
					routeData.Add(key, data[key]);
			}
			VirtualPathData virtualPath = RouteTable.Routes.GetVirtualPath(new RequestContext(context, new RouteData()), GetRoute(state, context), routeData);
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
#else
		public virtual string GetNavigationLink(State state, NameValueCollection data, HttpContext context)
		{
			return null;
		}

		public virtual NameValueCollection GetNavigationData(State state, NameValueCollection data)
		{
			return null;
		}
#endif
	}
}
