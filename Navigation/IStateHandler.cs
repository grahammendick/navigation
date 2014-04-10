using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// </summary>
	public interface IStateHandler
	{
		string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context);

		NameValueCollection GetNavigationData(State state, string navigationLink, HttpContextBase context);
	}
}
