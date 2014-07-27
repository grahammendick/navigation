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
			AddAttribute("route", route);
			AddAttribute("page", page);
		}
	}
}
