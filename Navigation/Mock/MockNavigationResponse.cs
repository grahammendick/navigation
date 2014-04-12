#if NET40Plus
using System.Web;

namespace Navigation
{
	internal class MockNavigationResponse : HttpResponseBase
	{
		private HttpCookieCollection _Cookies;

		public override string ApplyAppPathModifier(string virtualPath)
		{
			return virtualPath;
		}

		public override HttpCookieCollection Cookies
		{
			get
			{
				if (_Cookies == null)
					_Cookies = new HttpCookieCollection();
				return _Cookies;
			}
		}
	}
}
#endif