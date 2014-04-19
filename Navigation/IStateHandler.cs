using System.Collections.Specialized;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// </summary>
	public interface IStateHandler
	{
#if NET40Plus
		/// <summary>
		/// 
		/// </summary>
		/// <param name="state"></param>
		/// <param name="data"></param>
		/// <param name="context"></param>
		/// <returns></returns>
		string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context);

		/// <summary>
		/// 
		/// </summary>
		/// <param name="state"></param>
		/// <param name="context"></param>
		/// <returns></returns>
		NameValueCollection GetNavigationData(State state, HttpContextBase context);
#else
		string GetNavigationLink(State state, NameValueCollection data, HttpContext context);

		NameValueCollection GetNavigationData(State state, NameValueCollection data);
#endif
	}
}
