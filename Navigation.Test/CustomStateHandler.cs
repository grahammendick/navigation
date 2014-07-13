using System;
using System.Collections.Specialized;
using System.Web;

namespace Navigation.Test
{
	public class CustomStateHandler : IStateHandler
	{
#if NET40Plus
		public string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			return GetNavigationLink(state, data);
		}

		public NameValueCollection GetNavigationData(State state, HttpContextBase context)
		{
			return GetNavigationData(state, context.Request.QueryString);
		}

		public void NavigateLink(State state, string url, NavigationMode mode, HttpContextBase context)
		{
			context.Response.Redirect(url, false);
		}
#else
		public void NavigateLink(State state, string url, NavigationMode mode)
		{
			StateController.SetStateContext(state.Id, HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal))));
		}

#endif
		public string GetNavigationLink(State state, NameValueCollection data)
		{
			return state.Attributes["handler"].Substring(1) + "?previous=" + data[NavigationSettings.Config.PreviousStateIdKey] + "&custom";
		}

		public NameValueCollection GetNavigationData(State state, NameValueCollection data)
		{
			NameValueCollection navigationData = new NameValueCollection();
			navigationData[NavigationSettings.Config.StateIdKey] = state.Id;
			navigationData[NavigationSettings.Config.PreviousStateIdKey] = data["previous"];
			return navigationData;
		}
	}
}
