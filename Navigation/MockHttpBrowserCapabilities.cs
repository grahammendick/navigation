using System.Web;

namespace Navigation
{
	internal class MockHttpBrowserCapabilities : HttpBrowserCapabilitiesBase
	{
		public override bool IsMobileDevice
		{
			get
			{
				return false;
			}
		}
	}
}
