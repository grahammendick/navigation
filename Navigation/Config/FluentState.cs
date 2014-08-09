#if NET35Plus
using System;
using System.Collections.Generic;

namespace Navigation
{
	/// <summary>
	/// Configures <see cref="State"/> information. A child of a <see cref="FluentDialog"/> element
	/// </summary>
	public abstract class FluentState
	{
		private string _Title;
		private List<KeyValuePair<string, Type>> _DefaultTypes = new List<KeyValuePair<string, Type>>();
		private List<KeyValuePair<string, object>> _Defaults = new List<KeyValuePair<string, object>>();
		private List<string> _Derived = new List<string>();
		private bool _TrackCrumbTrail = true;
		private string _ResourceType;
		private string _ResourceKey;
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

#if NET40Plus
		internal string Route 
		{ 
			get;
			set;
		}
#endif

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

		internal IEnumerable<FluentTransition> Transitions
		{
			get
			{
				return _Transitions;
			}
		}

#if !NET40Plus
		/// <summary>
		/// Initializes a new instance of the <see cref="FluentState"/> class
		/// </summary>
		protected FluentState()
		{
		}
#else
		/// <summary>
		/// Initializes a new instance of the <see cref="FluentState"/> class
		/// </summary>
		/// <param name="route">The route Url pattern</param>
		protected FluentState(string route)
		{
			Route = route ?? string.Empty;
			if (!string.IsNullOrEmpty(route))
				AddAttribute("route", route);
		}
#endif

		/// <summary>
		/// Adds a <see cref="State"/> attribute
		/// </summary>
		/// <param name="key">The attribute key</param>
		/// <param name="value">The attribute value</param>
		protected internal void AddAttribute(string key, string value)
		{
			if (key != null)
				_Attributes.Add(new KeyValuePair<string, string>(key, value));
		}

		internal void AddTransition(string key, FluentState to)
		{
			_Transitions.Add(new FluentTransition(key, to));
		}
	}
}
#endif
