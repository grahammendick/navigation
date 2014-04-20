using System.Collections.Specialized;
using System.Web;

namespace Navigation.Test
{
	public class CustomStateHandler : IStateHandler
	{
#if NET40Plus
		public string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			return GetNavigationLink(state, data, (HttpContext) null);
		}

		public NameValueCollection GetNavigationData(State state, HttpContextBase context)
		{
			return GetNavigationData(state, context.Request.QueryString);
		}
#endif
		public string GetNavigationLink(State state, NameValueCollection data, HttpContext context)
		{
			return state.Attributes["handler"].Substring(1) + "?checksum=" + data["cs"];
		}

		public NameValueCollection GetNavigationData(State state, NameValueCollection data)
		{
			NameValueCollection navigationData = new NameValueCollection();
			navigationData[NavigationSettings.Config.StateIdKey] = state.Id;
			navigationData["cs"] = data["checksum"];
			return navigationData;
		}
	}
}
