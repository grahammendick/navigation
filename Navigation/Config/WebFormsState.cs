using System;

namespace Navigation
{
	public class WebFormsState : FluentState
	{
		public WebFormsState(string page)
			: this(string.Empty, page)
		{
		}

		public WebFormsState(string route, string page)
			: base(route)
		{
			if (string.IsNullOrEmpty(page))
				throw new ArgumentException("page");
			AddAttribute("page", page);
		}
	}
}
