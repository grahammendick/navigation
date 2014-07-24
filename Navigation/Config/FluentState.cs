namespace Navigation
{
	public abstract class FluentState
	{
		private string Route 
		{ 
			get;
			set;
		}

		internal object Defaults
		{
			get;
			set;
		}

		protected FluentState(string route)
		{
			Route = route;
		}
	}
}
