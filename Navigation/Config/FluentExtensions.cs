using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;

namespace Navigation
{
	public static partial class FluentExtensions
	{
		public static FluentDialog<UStates, UInitial> Title<UStates, UInitial>(this FluentDialog<UStates, UInitial> dialog, string title)
			where UStates : class
			where UInitial : FluentState
		{
			dialog.Title = title;
			return dialog;
		}

		public static FluentDialog<UStates, UInitial> Title<UStates, UInitial>(this FluentDialog<UStates, UInitial> dialog, string resourceType, string resourceKey)
			where UStates : class
			where UInitial : FluentState
		{
			dialog.ResourceType = resourceType;
			dialog.ResourceKey = resourceKey;
			return dialog;
		}

		public static FluentDialog<UStates, UInitial> Attributes<UStates, UInitial>(this FluentDialog<UStates, UInitial> dialog, object attributes)
			where UStates : class
			where UInitial : FluentState
		{
			foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(attributes))
			{
				if (defaultProperty.GetValue(attributes) != null)
					dialog.AddAttribute(defaultProperty.Name, Convert.ToString(defaultProperty.GetValue(attributes), CultureInfo.InvariantCulture));
			}
			return dialog;
		}

		public static K Title<K>(this K state, string title) where K : FluentState
		{
			state.Title = title;
			return state;
		}

		public static K Title<K>(this K state, string resourceType, string resourceKey) where K : FluentState
		{
			state.ResourceType = resourceType;
			state.ResourceKey = resourceKey;
			return state;
		}

		public static K DefaultTypes<K>(this K state, object defaultTypes) where K : FluentState
		{
			var defaultTypesDictionary = defaultTypes as IDictionary<string, Type>;
			if (defaultTypesDictionary == null)
			{
				foreach (PropertyDescriptor defaultTypeProperty in TypeDescriptor.GetProperties(defaultTypes))
				{
					var type = defaultTypeProperty.GetValue(defaultTypes) as Type;
					if (type == null)
						throw new ArgumentException("defaultTypes");
					state.DefaultTypes.Add(new KeyValuePair<string, Type>(defaultTypeProperty.Name, type));
				}
			}
			else
			{
				foreach (var defaultType in defaultTypesDictionary)
				{
					if (defaultType.Key != null && defaultType.Value != null)
						state.DefaultTypes.Add(new KeyValuePair<string, Type>(defaultType.Key.Trim(), defaultType.Value));
				}
			}
			return state;
		}

		public static K Defaults<K>(this K state, object defaults) where K : FluentState
		{
			var defaultsDictionary = defaults as IDictionary<string, object>;
			if (defaultsDictionary == null)
			{
				foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(defaults))
				{
					if (defaultProperty.GetValue(defaults) != null)
						state.Defaults.Add(new KeyValuePair<string, object>(defaultProperty.Name, defaultProperty.GetValue(defaults)));
				}
			}
			else
			{
				foreach (var defaultItem in defaultsDictionary)
				{
					if (defaultItem.Key != null && defaultItem.Value != null)
						state.Defaults.Add(new KeyValuePair<string, object>(defaultItem.Key.Trim(), defaultItem.Value));
				}
			}
			return state;
		}

		public static K Derived<K>(this K state, params string[] derived) where K : FluentState
		{
			foreach (var key in derived)
			{
				if (string.IsNullOrEmpty(key))
					throw new ArgumentException("derived");
				state.Derived.Add(key.Trim());
			}
			return state;
		}

		public static K TrackCrumbTrail<K>(this K state, bool trackCrumbTrail) where K : FluentState
		{
			state.TrackCrumbTrail = trackCrumbTrail;
			return state;
		}

		public static K Attributes<K>(this K state, object attributes) where K : FluentState
		{
			foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(attributes))
			{
				state.AddAttribute(defaultProperty.Name, Convert.ToString(defaultProperty.GetValue(attributes), CultureInfo.InvariantCulture));
			}
			return state;
		}
	}
}
