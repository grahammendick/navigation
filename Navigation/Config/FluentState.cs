using System;
using System.Collections.Generic;

namespace Navigation
{
	public abstract class FluentState
	{
		private List<FluentTransition> _Transitions = new List<FluentTransition>();

		internal string Key
		{
			get;
			set;
		}

		internal string Route 
		{ 
			get;
			set;
		}

		internal object Defaults
		{
			get;
			set;
		}

		internal IEnumerable<FluentTransition> Transitions
		{
			get
			{
				return _Transitions;
			}
		}

		protected FluentState(string route)
		{
			Route = route;
		}

		internal void AddTransition(string key, FluentState to)
		{
			_Transitions.Add(new FluentTransition(key, to));
		}
	}
}
