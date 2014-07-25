using System;

namespace Navigation
{
	public class FluentDialog<TStates, TInitial>
		where TStates : class
		where TInitial : FluentState
	{
		private FluentStateInfo StateInfo
		{ 
			get;
			set;
		}

		private TStates States
		{
			get;
			set;
		}

		internal FluentDialog(FluentStateInfo stateInfo, TStates states)
		{
			StateInfo = stateInfo;
		}

		public FluentDialog<TStates, TInitial> Transition(string key, Func<TStates, FluentState> from, Func<TStates, FluentState> to)
		{
			from(States).AddTransition(key, to(States));
			return this;
		}

		public FluentDialog<UStates, UInitial> Dialog<UStates, UInitial>(string key, UStates states, Func<UStates, UInitial> initial)
			where UStates : class
			where UInitial : FluentState
		{
			return StateInfo.Dialog(key, states, initial);
		}
	}
}
