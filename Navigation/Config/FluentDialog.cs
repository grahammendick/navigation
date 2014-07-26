using System;
using System.Collections.Generic;
using System.Reflection;

namespace Navigation
{
	public class FluentDialog<TStates, TInitial> : IFluentDialog
		where TStates : class
		where TInitial : FluentState
	{
		private string _Key;
		private TStates _States;
		private FluentState _Initial;

		private FluentStateInfo StateInfo
		{ 
			get;
			set;
		}

		string IFluentDialog.Key
		{
			get
			{
				return _Key;
			}
		}

		IEnumerable<FluentState> IFluentDialog.States
		{
			get
			{
				var fluentStates = _States.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public);
				foreach (var stateProperty in fluentStates)
				{
					var fluentState = (FluentState)stateProperty.GetValue(_States);
					fluentState.Key = stateProperty.Name;
					yield return fluentState;
				}
			}
		}

		FluentState IFluentDialog.Initial
		{
			get
			{
				return _Initial;
			}
		}

		internal FluentDialog(FluentStateInfo stateInfo, string key, TStates states, FluentState initial)
		{
			StateInfo = stateInfo;
			_Key = key;
			_States = states;
			_Initial = initial;
		}

		public FluentDialog<TStates, TInitial> Transition(string key, Func<TStates, FluentState> from, Func<TStates, FluentState> to)
		{
			from(_States).AddTransition(key, to(_States));
			return this;
		}

		public FluentDialog<UStates, UInitial> Dialog<UStates, UInitial>(string key, UStates states, Func<UStates, UInitial> initial)
			where UStates : class
			where UInitial : FluentState
		{
			return StateInfo.Dialog(key, states, initial);
		}

		public void Build()
		{
			StateInfo.Build();
		}
	}
}
