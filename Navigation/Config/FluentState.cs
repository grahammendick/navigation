using System;
using System.Collections.Generic;

namespace Navigation
{
	public abstract class FluentState
	{
		private string _Title;
		private List<KeyValuePair<string, Type>> _DefaultTypes = new List<KeyValuePair<string, Type>>();
		private List<KeyValuePair<string, object>> _Defaults = new List<KeyValuePair<string, object>>();
		private List<string> _Derived = new List<string>();
		private bool _TrackCrumbTrail = true;
		private List<KeyValuePair<string, string>> _Attributes = new List<KeyValuePair<string, string>>();
		private List<FluentTransition> _Transitions = new List<FluentTransition>();

		internal string Key
		{
			get;
			set;
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

		internal string Route 
		{ 
			get;
			set;
		}

		internal List<KeyValuePair<string, Type>> DefaultTypes
		{
			get
			{
				return _DefaultTypes;
			}
		}

		internal List<KeyValuePair<string, object>> Defaults
		{
			get
			{
				return _Defaults;
			}
		}

		internal List<string> Derived
		{
			get
			{
				return _Derived;
			}
		}

		internal bool TrackCrumbTrail
		{
			get
			{
				return _TrackCrumbTrail;
			}
			set
			{
				_TrackCrumbTrail = value;
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
