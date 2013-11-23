using System.Linq;
using System.Web;
using System.Web.Routing;

namespace Navigation
{
	internal class MockNavigationContext : HttpContextBase
	{
		private MockNavigationRequest _Request;
		private MockNavigationResponse _Response;

		internal MockNavigationContext(string url)
			: base()
		{
			Url = url;
		}

		private string Url
		{
			get;
			set;
		}

		public override HttpRequestBase Request
		{
			get
			{
				if (_Request == null)
				{
					_Request = new MockNavigationRequest(Url);
					if (Url != null)
					{
						RouteData routeData = RouteTable.Routes.GetRouteData(this) ?? new RouteData();
						foreach (string key in routeData.Values.Keys.ToArray())
						{
							routeData.Values[key] = HttpUtility.UrlDecode((string)routeData.Values[key]);
						}
						_Request.RequestContext = new RequestContext(this, routeData);
					}
					else
					{
						_Request.RequestContext = new RequestContext(this, new RouteData());
					}
				}
				return _Request;
			}
		}

		public override HttpResponseBase Response
		{
			get
			{
				if (_Response == null)
					_Response = new MockNavigationResponse();
				return _Response;
			}
		}
	}
}
