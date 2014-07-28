using System;
using System.Collections.Generic;

namespace Navigation
{
	public abstract class FluentState
	{
		private List<KeyValuePair<string, string>> _Attributes = new List<KeyValuePair<string, string>>();
		private List<KeyValuePair<string, Type>> _DefaultTypes = new List<KeyValuePair<string, Type>>();
		private List<KeyValuePair<string, object>> _Defaults = new List<KeyValuePair<string, object>>();
		private List<string> _Derived = new List<string>();
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

		internal IEnumerable<KeyValuePair<string, Type>> DefaultTypes
		{
			get
			{
				return _DefaultTypes;
			}
		}

		internal IEnumerable<KeyValuePair<string, object>> Defaults
		{
			get
			{
				return _Defaults;
			}
		}

		internal IEnumerable<string> Derived
		{
			get
			{
				return _Derived;
			}
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
			Route = route ?? string.Empty;
			if (!string.IsNullOrEmpty(route))
				AddAttribute("route", route);
		}

		internal void AddDefaultType(string key, Type type)
		{
			_DefaultTypes.Add(new KeyValuePair<string, Type>(key, type));
		}

		internal void AddDefault(string key, object value)
		{
			_Defaults.Add(new KeyValuePair<string, object>(key, value));
		}

		internal void AddDerived(string key)
		{
			_Derived.Add(key);
		}

		protected internal void AddAttribute(string key, string value)
		{
			if (string.IsNullOrEmpty(key))
				throw new ArgumentException("key");
			if (string.IsNullOrEmpty(value))
				throw new ArgumentException("value");
			_Attributes.Add(new KeyValuePair<string, string>(key, value));
		}

		internal void AddTransition(string key, FluentState to)
		{
			_Transitions.Add(new FluentTransition(key, to));
		}
	}
}
