using System;

namespace Navigation
{
	public class WebFormsState : FluentState
	{
#if !NET40Plus
		public WebFormsState(string page)
		{
		}
#else
		public WebFormsState(string route, string page)
			: base(route)
		{
			if (string.IsNullOrEmpty(page))
				throw new ArgumentException("page");
			AddAttribute("page", page);
		}
#endif
	}
}
