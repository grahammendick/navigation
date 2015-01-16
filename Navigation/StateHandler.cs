#if NET40Plus
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using System.Web.Routing;

namespace Navigation
{
	/// <summary>
	/// Implementation of <see cref="Navigation.IStateHandler"/> that builds and parses
	/// navigation links for a routed <see cref="Navigation.State"/>
	/// </summary>
	public abstract class StateHandler : IStateHandler
	{
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
			VirtualPathData virtualPath = RouteTable.Routes.GetVirtualPath(new RequestContext(context, new RouteData()), GetRouteName(state, context), routeData);
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
			RouteData routeData = context.Request.RequestContext.RouteData;
			if (routeData.DataTokens[NavigationSettings.Config.StateIdKey] != null)
			{
				queryData[NavigationSettings.Config.StateIdKey] = (string)routeData.DataTokens[NavigationSettings.Config.StateIdKey];
			}
			foreach (string key in routeData.Values.Keys)
			{
				if (routeData.Values[key] != null)
				{
					queryData.Add(key, (string)routeData.Values[key]);
				}
			}
			foreach (string key in context.Request.QueryString)
			{
				queryData.Add(key, context.Request.QueryString[key]);
			}
			return queryData;
		}

		/// <summary>
		/// Redirects or Transfers to the <paramref name="url"/> depending on the 
		/// <paramref name="mode"/> specified
		/// </summary>
		/// <param name="state">The <see cref="State"/> to navigate to</param>
		/// <param name="url">The target location</param>
		/// <param name="mode">Indicates whether to Redirect or Transfer</param>
		/// <param name="context">The current context</param>
		public virtual void NavigateLink(State state, string url, NavigationMode mode, HttpContextBase context)
		{
			if (mode != NavigationMode.Server)
			{
				if (!GetPermanent(state, context))
					context.Response.Redirect(url, GetEndResponse(state, context));
				else
					context.Response.RedirectPermanent(url, GetEndResponse(state, context));
			}
			else
				context.Server.Transfer(url, GetPreserveForm(state, context));
		}

		/// <summary>
		/// Returns the route name of the <paramref name="state"/>
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="context">The current context</param>
		/// <returns>The route name</returns>
		protected abstract string GetRouteName(State state, HttpContextBase context);

		/// <summary>
		/// Gets an indicator determining whether to terminate the current process when
		/// navigating with a <see cref="NavigationMode.Client"/> mode
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="context">The current context</param>
		/// <returns>Current process termination indicator</returns>
		protected virtual bool GetEndResponse(State state, HttpContextBase context)
		{
			return false;
		}

		/// <summary>
		/// Gets an indicator determining whether to permanently redirect when
		/// navigating with a <see cref="NavigationMode.Client"/> mode
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="context">The current context</param>
		/// <returns>Permanent redirection indicator</returns>
		protected virtual bool GetPermanent(State state, HttpContextBase context)
		{
			return false;
		}

		/// <summary>
		/// Gets an indicator determining whether to preserve the <see cref="System.Web.HttpRequest.Form"/>
		/// and <see cref="System.Web.HttpRequest.QueryString"/> collections when navigating with a
		/// <see cref="NavigationMode.Server"/> mode
		/// </summary>
		/// <param name="state">The <see cref="Navigation.State"/> to navigate to</param>
		/// <param name="context">The current context</param>
		/// <returns>Request collections perservation indicator</returns>
		protected virtual bool GetPreserveForm(State state, HttpContextBase context)
		{
			return false;
		}

		public virtual List<Crumb> TruncateCrumbTrail(State state, List<Crumb> crumbs)
		{
			var newCrumbs = new List<Crumb>();
			if (state.Parent.Initial == state)
				return newCrumbs;
			foreach (var crumb in crumbs)
			{
				if (crumb.State == state)
					break;
				newCrumbs.Add(crumb);
			}
			return newCrumbs;
		}
	}
}
#endif
