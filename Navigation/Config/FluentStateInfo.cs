using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Navigation
{
	public class FluentStateInfo
	{
		private List<FluentDialog> _Dialogs = new List<FluentDialog>();

		internal FluentStateInfo()
		{
		}

		public FluentDialog<TStates, TInitial> Dialog<TStates, TInitial>(string key, TStates states, Func<TStates, TInitial> initial)
			where TStates : class
			where TInitial : FluentState
		{
			if (states == null)
				throw new ArgumentNullException("states");
			if (initial == null)
				throw new ArgumentNullException("initial");
			if (string.IsNullOrEmpty(key))
				throw new ArgumentException("key");
			var dialog = new FluentDialog<TStates, TInitial>(this, key, states, initial(states));
			_Dialogs.Add(dialog);
			return dialog;
		}

		public void Build()
		{
			StateInfoCollection<Dialog> dialogs = new StateInfoCollection<Dialog>();
			Dialog dialog;
			int dialogIndex = 0;
			foreach (var fluentDialog in _Dialogs)
			{
				dialog = new Dialog();
				dialog.Index = dialogIndex;
				dialogIndex++;
				dialog.Key = fluentDialog.Key;
				dialog.Title = fluentDialog.Title;
				dialog.ResourceType = fluentDialog.ResourceType;
				dialog.ResourceKey = fluentDialog.ResourceKey;
				dialog.Attributes = new StateInfoCollection<string>();
				foreach (var attribute in fluentDialog.Attributes)
					dialog.Attributes[attribute.Key] = attribute.Value;
				ProcessStates(dialog, fluentDialog);
				ProcessTransitions(dialog, fluentDialog);
				dialogs.Add(fluentDialog.Key, dialog);
			}
			StateInfoConfig.Dialogs = dialogs;
			StateInfoConfig.AddStateRoutes();
			_Dialogs.Clear();
		}

		private static void ProcessStates(Dialog dialog, FluentDialog fluentDialog)
		{
			State state;
			int stateIndex = 0;
			List<string> derived;
			foreach (var fluentState in fluentDialog.States)
			{
				state = new State();
				state.Parent = dialog;
				state.Index = stateIndex;
				stateIndex++;
				state.Key = fluentState.Key;
				state.Title = fluentState.Title;
				state.DefaultTypes = new StateInfoCollection<Type>();
				foreach (var defaultType in fluentState.DefaultTypes)
					state.DefaultTypes[defaultType.Key] = defaultType.Value;
				state.Defaults = new StateInfoCollection<object>();
				state.FormattedDefaults = new StateInfoCollection<string>();
				foreach (var def in fluentState.Defaults)
				{
					state.Defaults[def.Key] = def.Value;
					state.FormattedDefaults[def.Key] = CrumbTrailManager.FormatURLObject(def.Key, def.Value, state);
				}
				derived = new List<string>();
				state.DerivedInternal = new Dictionary<string, string>();
				foreach (var key in fluentState.Derived)
				{
					derived.Add(key);
					state.DerivedInternal.Add(key, key);
				}
				state.Derived = new ReadOnlyCollection<string>(derived);
				state.TrackCrumbTrail = fluentState.TrackCrumbTrail;
				state.ResourceType = fluentState.ResourceType;
				state.ResourceKey = fluentState.ResourceKey;
				state.Attributes = new StateInfoCollection<string>();
				foreach (var attribute in fluentState.Attributes)
					state.Attributes[attribute.Key] = attribute.Value;
				dialog.States[fluentState.Key] = state;
			}
		}

		private static void ProcessTransitions(Dialog dialog, FluentDialog fluentDialog)
		{
			State state;
			Transition transition;
			int transitionIndex = 0;
			foreach (var fluentState in fluentDialog.States)
			{
				foreach (var fluentTransition in fluentState.Transitions)
				{
					state = dialog.States[fluentState.Key];
					transition = new Transition();
					transition.Parent = state;
					transition.Index = transitionIndex;
					transitionIndex++;
					transition.Key = fluentTransition.Key;
					transition.To = dialog.States[fluentTransition.To.Key];
					state.Transitions[fluentTransition.Key] = transition;
				}
			}
		}
	}
}
