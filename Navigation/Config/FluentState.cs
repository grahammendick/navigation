using System;
using System.Collections.Generic;

namespace Navigation
{
	public abstract class FluentState
	{
		private List<Tuple<string, FluentState>> _Transitions = new List<Tuple<string,FluentState>>();

		private string Route 
		{ 
			get;
			set;
		}

		internal object Defaults
		{
			get;
			set;
		}

		internal IEnumerable<Tuple<string, FluentState>> Transitions
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
			_Transitions.Add(Tuple.Create(key, to));
		}
	}
}
