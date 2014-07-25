namespace Navigation
{
	internal interface IFluentDialog
	{
		string Key
		{
			get;
		}

		object States
		{
			get;
		}

		FluentState Initial
		{
			get;
		}
	}
}
