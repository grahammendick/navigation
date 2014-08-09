#if NET40Plus
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace Navigation
{
	/// <summary>
	/// Configures <see cref="Dialog"/> information. Represents a logical grouping of child
	/// <see cref="FluentState"/> elements
	/// </summary>
	public abstract class FluentDialog
	{
		private string _Title;
		private string _ResourceType;
		private string _ResourceKey;
		private List<KeyValuePair<string, string>> _Attributes = new List<KeyValuePair<string, string>>();

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

		internal string Title
		{
			get
			{
				return _Title ?? string.Empty;
			}
			set
			{
				_Title = value;
			}
		}

		internal string ResourceType
		{
			get
			{
				return _ResourceType ?? "StateInfo";
			}
			set
			{
				_ResourceType = value;
			}
		}

		internal string ResourceKey
		{
			get
			{
				return _ResourceKey ?? string.Empty;
			}
			set
			{
				_ResourceKey = value;
			}
		}

		internal IEnumerable<KeyValuePair<string, string>> Attributes
		{
			get
			{
				return _Attributes;
			}
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="FluentDialog"/> class
		/// </summary>
		/// <param name="key">The unique dialog key</param>
		/// <param name="states">The <see cref="FluentState"/> children</param>
		/// <param name="initial">The state to navigate to</param>
		protected FluentDialog(string key, IEnumerable<FluentState> states, FluentState initial)
		{
			Key = key;
			States = states;
			Initial = initial;
		}

		/// <summary>
		/// Adds a <see cref="Dialog"/> attribute
		/// </summary>
		/// <param name="key">The attribute key</param>
		/// <param name="value">The attribute value</param>
		protected internal void AddAttribute(string key, string value)
		{
			if (key != null)
				_Attributes.Add(new KeyValuePair<string, string>(key, value));
		}
	}

	/// <summary>
	/// Configures <see cref="Dialog"/> information. Represents a logical grouping of child
	/// <see cref="FluentState"/> elements
	/// </summary>
	/// <typeparam name="TStates">Type holding the <see cref="FluentState"/> children</typeparam>
	/// <typeparam name="TInitial">Selects the state to navigate to</typeparam>
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
			foreach (PropertyDescriptor stateProperty in TypeDescriptor.GetProperties(states))
			{
				var fluentState = (FluentState)stateProperty.GetValue(states);
				fluentState.Key = stateProperty.Name;
				yield return fluentState;
			}
		}

		/// <summary>
		/// Configures <see cref="Transition"/> information. A child of a <see cref="State"/> element it represents
		/// a possible navigation from its parent <see cref="FluentState"/> to a sibling <see cref="FluentState"/>
		/// </summary>
		/// <param name="key">The unique transition key</param>
		/// <param name="from">Selects the from <see cref="FluentState"/></param>
		/// <param name="to">Selects the to <see cref="FluentState"/></param>
		/// <returns>The <see cref="FluentDialog"/></returns>
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

		/// <summary>
		/// Configures <see cref="Dialog"/> information and represents a logical grouping of 
		/// child <see cref="FluentState"/> elements
		/// </summary>
		/// <typeparam name="UStates">Type holding the <see cref="FluentState"/> children</typeparam>
		/// <typeparam name="UInitial">Selects the state to navigate to</typeparam>
		/// <param name="key">The unique dialog key</param>
		/// <param name="states">The <see cref="FluentState"/> children</param>
		/// <param name="initial">The state to navigate to</param>
		/// <returns><see cref="FluentDialog"/> holding <see cref="Dialog"/> information</returns>
		public FluentDialog<UStates, UInitial> Dialog<UStates, UInitial>(string key, UStates states, Func<UStates, UInitial> initial)
			where UStates : class
			where UInitial : FluentState
		{
			return StateInfo.Dialog(key, states, initial);
		}

		/// Builds the <see cref="Navigation.Dialog"/>, <see cref="Navigation.State"/>
		/// and <see cref="Navigation.Transition"/> configuration
		public void Build()
		{
			StateInfo.Build();
		}
	}
}
#endif
