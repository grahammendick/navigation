namespace Navigation
{
	public class WebFormsState : FluentState
	{
		private string Page
		{ 
			get;
			set;
		}

		internal string Theme
		{
			get;
			set;
		}

		public WebFormsState(string route, string page) 
			: base(route)
		{
			Page = page;
		}
	}
}
