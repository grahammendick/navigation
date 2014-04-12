using System.Collections.Specialized;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// </summary>
	public interface IStateHandler
	{
		string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context);

		NameValueCollection GetNavigationData(State state, HttpContextBase context);
	}
}
