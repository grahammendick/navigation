using System.Collections.Specialized;
using System.Web;

namespace Navigation.WebApi
{
	public class WebApiStateHandler : StateHandler
	{
		public override string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			data["httproute"] = "";
			return base.GetNavigationLink(state, data, context);
		}

		public override NameValueCollection GetNavigationData(State state, HttpContextBase context)
		{
			NameValueCollection data = base.GetNavigationData(state, context);
			data.Remove("controller");
			data.Remove("action");
			return data;
		}

		protected override string GetRouteName(State state, HttpContextBase context)
		{
			return "WebApi" + state.Id;
		}
	}
}
