namespace Navigation
{
	public class WebFormsState : FluentState
	{
		public WebFormsState(string page)
			: this("", page)
		{
		}

		public WebFormsState(string route, string page)
			: base(route)
		{
			AddAttribute("page", page);
		}
	}
}
