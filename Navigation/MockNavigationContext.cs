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
					_Request = new MockNavigationRequest(this, Url);
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
