#if NET40Plus
using System.Collections;
using System.Web;
using System.Web.Routing;

namespace Navigation
{
	internal class MockNavigationContext : HttpContextBase
	{
		private HttpRequestBase _Request;
		private HttpResponseBase _Response;
		private HttpServerUtilityBase _Server;
		private Hashtable _Items;

		internal MockNavigationContext(string url, State state)
			: base()
		{
			Url = url;
			State = state;
		}

		private string Url
		{
			get;
			set;
		}

		internal State State
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
					_Response = new MockNavigationResponse(State);
				return _Response;
			}
		}

		public override HttpServerUtilityBase Server
		{
			get
			{
				if (_Server == null)
					_Server = new MockHttpServerUtility(State);
				return _Server;
			}
		}

		public override IDictionary Items
		{
			get
			{
				if (_Items == null)
					_Items = new Hashtable();
				return _Items;
			}
		}
	}
}
#endif