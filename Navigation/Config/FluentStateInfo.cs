using System;
using System.Collections.Generic;

namespace Navigation
{
	public class FluentStateInfo
	{
		private List<IFluentDialog> _Dialogs = new List<IFluentDialog>();

		public FluentDialog<TStates, TInitial> Dialog<TStates, TInitial>(string key, TStates states, Func<TStates, TInitial> initial)
			where TStates : class
			where TInitial : FluentState
		{
			var dialog = new FluentDialog<TStates, TInitial>(this, key, states, initial(states));
			_Dialogs.Add(dialog);
			return dialog;
		}
	}
}
