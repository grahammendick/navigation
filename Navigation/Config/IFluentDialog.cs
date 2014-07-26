using System.Collections.Generic;
namespace Navigation
{
	internal interface IFluentDialog
	{
		string Key
		{
			get;
		}

		IEnumerable<FluentState> States
		{
			get;
		}

		FluentState Initial
		{
			get;
		}
	}
}
