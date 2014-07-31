using System;

namespace Navigation
{
	public class WebFormsState : FluentState
	{
#if !NET40Plus
		public WebFormsState(string page)
			: this(string.Empty, page)
		{
		}
#endif

		public WebFormsState(string route, string page)
			: base(route)
		{
			if (string.IsNullOrEmpty(page))
				throw new ArgumentException("page");
			AddAttribute("page", page);
		}
	}
}
