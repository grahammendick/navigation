using System;
using System.Collections.Generic;
using System.Reflection;

namespace Navigation
{
	public abstract class FluentDialog
	{
		internal string Key
		{
			get;
			private set;
		}

		internal IEnumerable<FluentState> States
		{
			get;
			private set;
		}

		internal FluentState Initial
		{
			get;
			private set;
		}

		protected FluentDialog(string key, IEnumerable<FluentState> states, FluentState initial)
		{
			Key = key;
			States = states;
			Initial = initial;
		}
	}

	public class FluentDialog<TStates, TInitial> : FluentDialog
		where TStates : class
		where TInitial : FluentState
	{
		private TStates _States;

		private FluentStateInfo StateInfo
		{ 
			get;
			set;
		}

		internal FluentDialog(FluentStateInfo stateInfo, string key, TStates states, FluentState initial)
			: base(key, GetStates(states), initial)
		{
			StateInfo = stateInfo;
			_States = states;
		}

		private static IEnumerable<FluentState> GetStates(TStates states)
		{
			var fluentStates = states.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public);
			foreach (var stateProperty in fluentStates)
			{
				var fluentState = (FluentState)stateProperty.GetValue(states);
				fluentState.Key = stateProperty.Name;
				yield return fluentState;
			}
		}

		public FluentDialog<TStates, TInitial> Transition(string key, Func<TStates, FluentState> from, Func<TStates, FluentState> to)
		{
			if (from == null)
				throw new ArgumentNullException("from");
			if (to == null)
				throw new ArgumentNullException("to");
			if (string.IsNullOrEmpty(key))
				throw new ArgumentException("key");
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
