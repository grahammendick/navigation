using System.Collections.Specialized;
using System.Web;
#if NET40Plus
using System.Web.Routing;
#endif

namespace Navigation
{
	/// <summary>
	/// Implementation of <see cref="Navigation.IStateHandler"/> that builds and parses
	/// navigation links for a routed <see cref="Navigation.State"/>
	/// </summary>
	public class StateHandler : IStateHandler
	{
#if NET40Plus
		/// <summary>
		/// Gets a routed link that navigates to the <paramref name="state"/> passing 
		/// the <paramref name="data"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="data">The data to pass when navigating</param>
		/// <param name="context">The current context</param>
		/// <returns>The routed navigation link</returns>
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

		/// <summary>
		/// Gets the data parsed from the Route and QueryString of the <paramref name="context"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> navigated to</param>
		/// <param name="context">The current context</param>
		/// <returns>The navigation data</returns>
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

		/// <summary>
		/// Returns the route of the <paramref name="state"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="context">The current context</param>
		/// <returns>The route name</returns>
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
