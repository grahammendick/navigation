#if NET35Plus
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;

namespace Navigation
{
	/// <summary>
	/// Represents support for fluently building <see cref="Navigation.Dialog"/>, <see cref="Navigation.State"/>
	/// and <see cref="Navigation.Transition"/> configuration
	/// </summary>
	public static partial class FluentExtensions
	{
		/// <summary>
		/// Sets the textual description of the <see cref="Dialog"/>
		/// </summary>
		/// <typeparam name="TStates">Type holding the <see cref="FluentState"/> children</typeparam>
		/// <typeparam name="TInitial">Selects the state to navigate to</typeparam>
		/// <param name="dialog">The <see cref="FluentDialog"/></param>
		/// <param name="title">The textual description</param>
		/// <returns>The <see cref="FluentDialog"/></returns>
		public static FluentDialog<TStates, TInitial> Title<TStates, TInitial>(this FluentDialog<TStates, TInitial> dialog, string title)
			where TStates : class
			where TInitial : FluentState
		{
			dialog.Title = title;
			return dialog;
		}

		/// <summary>
		/// Sets the textual description of the <see cref="Dialog"/>
		/// </summary>
		/// <typeparam name="TStates">Type holding the <see cref="FluentState"/> children</typeparam>
		/// <typeparam name="TInitial">Selects the state to navigate to</typeparam>
		/// <param name="dialog">The <see cref="FluentDialog"/></param>
		/// <param name="resourceType">The resource type</param>
		/// <param name="resourceKey">The resource key</param>
		/// <returns>The <see cref="FluentDialog"/></returns>
		public static FluentDialog<TStates, TInitial> Title<TStates, TInitial>(this FluentDialog<TStates, TInitial> dialog, string resourceType, string resourceKey)
			where TStates : class
			where TInitial : FluentState
		{
			dialog.ResourceType = resourceType;
			dialog.ResourceKey = resourceKey;
			return dialog;
		}

		/// <summary>
		/// Adds <see cref="Dialog"/> attributes
		/// </summary>
		/// <typeparam name="TStates">Type holding the <see cref="FluentState"/> children</typeparam>
		/// <typeparam name="TInitial">Selects the state to navigate to</typeparam>
		/// <param name="dialog">The <see cref="FluentDialog"/></param>
		/// <param name="attributes">The attributes</param>
		/// <returns>The <see cref="FluentDialog"/></returns>
		public static FluentDialog<TStates, TInitial> Attributes<TStates, TInitial>(this FluentDialog<TStates, TInitial> dialog, object attributes)
			where TStates : class
			where TInitial : FluentState
		{
			foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(attributes))
			{
				if (defaultProperty.GetValue(attributes) != null)
					dialog.AddAttribute(defaultProperty.Name, Convert.ToString(defaultProperty.GetValue(attributes), CultureInfo.InvariantCulture));
			}
			return dialog;
		}

		/// <summary>
		/// Sets the textual description of the <see cref="State"/>
		/// </summary>
		/// <typeparam name="K">The type of the <see cref="FluentState"/></typeparam>
		/// <param name="state">The <see cref="FluentState"/></param>
		/// <param name="title">The textual description</param>
		/// <returns>The <see cref="FluentState"/></returns>
		public static K Title<K>(this K state, string title) where K : FluentState
		{
			state.Title = title;
			return state;
		}

		/// <summary>
		/// Sets the textual description of the <see cref="State"/>
		/// </summary>
		/// <typeparam name="K">The type of the <see cref="FluentState"/></typeparam>
		/// <param name="state">The <see cref="FluentState"/></param>
		/// <param name="resourceType">The resource type</param>
		/// <param name="resourceKey">The resource key</param>
		/// <returns>The <see cref="FluentState"/></returns>
		public static K Title<K>(this K state, string resourceType, string resourceKey) where K : FluentState
		{
			state.ResourceType = resourceType;
			state.ResourceKey = resourceKey;
			return state;
		}

		/// <summary>
		/// Sets the default <see cref="NavigationData"/>
		/// </summary>
		/// <typeparam name="K">The type of the <see cref="FluentState"/></typeparam>
		/// <param name="state">The <see cref="FluentState"/></param>
		/// <param name="defaults">The default <see cref="NavigationData"/></param>
		/// <returns>The <see cref="FluentState"/></returns>
		public static K Defaults<K>(this K state, object defaults) where K : FluentState
		{
			var defaultsDictionary = defaults as IDictionary<string, object>;
			if (defaultsDictionary == null)
			{
				foreach (PropertyDescriptor defaultProperty in TypeDescriptor.GetProperties(defaults))
				{
					SetDefault(state, defaultProperty.Name, defaultProperty.GetValue(defaults));
				}
			}
			else
			{
				foreach (var defaultItem in defaultsDictionary)
				{
					SetDefault(state, defaultItem.Key.Trim(), defaultItem.Value);
				}
			}
			return state;
		}

		private static void SetDefault<K>(K state, string key, object value) where K : FluentState
		{
			if (key != null && value != null)
			{
				var type = value as Type;
				if (type != null)
					state.DefaultTypes.Add(new KeyValuePair<string, Type>(key, type));
				else
					state.Defaults.Add(new KeyValuePair<string, object>(key, value));
			}

		}

		/// <summary>
		/// Sets the derived <see cref="NavigationData"/>
		/// </summary>
		/// <typeparam name="K">The type of the <see cref="FluentState"/></typeparam>
		/// <param name="state">The <see cref="FluentState"/></param>
		/// <param name="derived">The derived <see cref="NavigationData"/></param>
		/// <returns>The <see cref="FluentState"/></returns>
		public static K Derived<K>(this K state, params string[] derived) where K : FluentState
		{
			foreach (var key in derived)
			{
				if (key != null)
					state.Derived.Add(key.Trim());
			}
			return state;
		}

		/// <summary>
		/// Sets a value that indicates whether to maintain crumb trail information 
		/// </summary>
		/// <typeparam name="K">The type of the <see cref="FluentState"/></typeparam>
		/// <param name="state">The <see cref="FluentState"/></param>
		/// <param name="trackCrumbTrail">Maintain crumb trail indicator</param>
		/// <returns>The <see cref="FluentState"/></returns>
		public static K TrackCrumbTrail<K>(this K state, bool trackCrumbTrail) where K : FluentState
		{
			state.TrackCrumbTrail = trackCrumbTrail;
			return state;
		}

		/// <summary>
		/// Adds <see cref="State"/> attributes
		/// </summary>
		/// <typeparam name="K">The type of the <see cref="FluentState"/></typeparam>
		/// <param name="state">The <see cref="FluentState"/></param>
		/// <param name="attributes">The attributes</param>
		/// <returns>The <see cref="FluentState"/></returns>
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
#endif
