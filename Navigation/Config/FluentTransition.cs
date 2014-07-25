namespace Navigation
{
	internal class FluentTransition
	{
		private string Key
		{
			get;
			set;
		}

		internal FluentState To
		{
			get;
			set;
		}

		internal FluentTransition(string key, FluentState to)
		{
			Key = key;
			To = to;
		}
	}
}
