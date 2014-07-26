using System;
using System.Collections.Generic;

namespace Navigation
{
	public abstract class FluentState
	{
		private List<KeyValuePair<string, string>> _Attributes = new List<KeyValuePair<string, string>>();
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

		internal IEnumerable<KeyValuePair<string, string>> Attributes
		{
			get
			{
				return _Attributes;
			}
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

		protected internal void AddAttribute(string key, string value)
		{
			_Attributes.Add(new KeyValuePair<string, string>(key, value));
		}

		internal void AddTransition(string key, FluentState to)
		{
			_Transitions.Add(new FluentTransition(key, to));
		}
	}
}
