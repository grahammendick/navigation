using System;
using System.Collections.Generic;

namespace Navigation
{
	public class FluentStateInfo
	{
		private List<Tuple<string, object, FluentState>> _Dialogs = new List<Tuple<string, object, FluentState>>();

		public FluentDialog<TStates, TInitial> Dialog<TStates, TInitial>(string key, TStates states, Func<TStates, TInitial> initial)
			where TStates : class
			where TInitial : FluentState
		{
			_Dialogs.Add(Tuple.Create(key, (object) states, (FluentState) initial(states)));
			return new FluentDialog<TStates, TInitial>(this, states);
		}
	}
}
