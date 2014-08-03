using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Navigation.Test
{
	public class CustomState : FluentState
	{
		public CustomState(string handler) 
			: base("")
		{
			AddAttribute("handler", handler);
		}
	}
}
