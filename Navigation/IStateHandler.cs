using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Navigation
{
	/// <summary>
	/// 
	/// </summary>
	public interface IStateHandler
	{
		string GetNavigationLink(State state, NameValueCollection data);
	}
}
