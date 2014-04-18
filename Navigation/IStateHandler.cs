using System.Collections.Specialized;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// </summary>
	public interface IStateHandler
	{
#if NET40Plus
		string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context);

		NameValueCollection GetNavigationData(State state, HttpContextBase context);
#else
		string GetNavigationLink(State state, NameValueCollection data, HttpContext context);

		NameValueCollection GetNavigationData(State state, HttpContext context);
#endif
	}
}
