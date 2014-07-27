using System;
using System.Collections.Generic;
using System.Reflection;

namespace Navigation
{
	public abstract class FluentDialog
	{
		internal abstract string Key { get; }
		internal abstract IEnumerable<FluentState> States { get; }
		internal abstract FluentState Initial { get; }
	}

	public class FluentDialog<TStates, TInitial> : FluentDialog
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

		internal override string Key
		{
			get
			{
				return _Key;
			}
		}

		internal override IEnumerable<FluentState> States
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

		internal override FluentState Initial
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
