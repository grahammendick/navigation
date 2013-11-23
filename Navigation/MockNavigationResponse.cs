#if NET40Plus
using System.Web;

namespace Navigation
{
	internal class MockNavigationResponse : HttpResponseBase
	{
		public override string ApplyAppPathModifier(string virtualPath)
		{
			return virtualPath;
		}
	}
}
#endif