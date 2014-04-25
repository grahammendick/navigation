using System.Collections;
using System.Collections.Generic;
#if NET40Plus
using System.Dynamic;
#endif
using System.Web.UI;

namespace Navigation
{
	/// <summary>
	/// Manages the data passed when navigating. It implements <see cref="System.Web.UI.IStateManager"/>
	/// and so maintains this data across post backs (in Web Forms). This data is accesssible from the
	/// state context <see cref="Navigation.StateContext.Data"/> property. It is stored on each
	/// <see cref="Navigation.Crumb"/> in a crumb trail as it represents the data required to recreate
	/// the <see cref="Navigation.State"/> as previously visited
	/// </summary>
	public sealed class NavigationData : IStateManager, IEnumerable, IEnumerable<NavigationDataItem>
	{
		private StateBag _Data;
#if NET40Plus
		private DynamicNavigationData _DynamicNavigationData;
#endif
		private StateInfoCollection<object> _Defaults;

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationData"/> class
		/// </summary>
		public NavigationData() : this(false)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationData"/> class containing
		/// all the current <see cref="Navigation.StateContext.Data"/>
		/// </summary>
		/// <param name="includeCurrent">Identifies whether the current <see cref="Navigation.StateContext.Data"/>
		/// should be included</param>
		public NavigationData(bool includeCurrent)
			: base()
		{
			if (includeCurrent)
			{
				foreach (NavigationDataItem item in StateContext.Data)
				{
					this[item.Key] = item.Value;
				}

			}
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationData"/> class containing
		/// a subset of the current <see cref="Navigation.StateContext.Data"/>
		/// </summary>
		/// <param name="currentDataKeys">The subset of the current <see cref="Navigation.StateContext.Data"/>
		/// to include</param>
		public NavigationData(IEnumerable<string> currentDataKeys)
			: base()
		{
			foreach (string key in currentDataKeys)
			{
				this[key] = StateContext.Data[key];
			}
		}

		private StateBag Data
		{
			get
			{
				if (_Data == null)
				{
					_Data = new StateBag();
					((IStateManager)_Data).TrackViewState();
				}
				return _Data;
			}
		}

		private StateInfoCollection<object> Defaults
		{
			get
			{
				return _Defaults;
			}
			set
			{
				_Defaults = value;
			}
		}

		/// <summary>
		/// Adds a new item to the underlying <see cref="System.Web.UI.StateBag"/>, updating the item
		/// if it already exists. If the <paramref name="value"/> is null the item is removed
		/// </summary>
		/// <param name="key">The key for the navigation data item</param>
		/// <param name="value">The value for navigation data item</param>
		public void Add(string key, object value)
		{
			if (value != null)
			{
				object defaultValue = Defaults != null ? Defaults[key] : null;
				if (value.Equals(string.Empty) && defaultValue != null)
					value = defaultValue;
				Data.Add(key, value);
				if (Data[key].Equals(defaultValue))
					Data.SetItemDirty(key, false);
			}
			else
				Remove(key);
		}

		/// <summary>
		/// Removes the specified key/value pair from the <see cref="System.Web.UI.StateBag"/>. This
		/// is the equivalent of setting the value to null
		/// </summary>
		/// <param name="key"></param>
		public void Remove(string key)
		{
			if (Defaults != null && Defaults[key] != null)
				Add(key, Defaults[key]);
			else
				Data.Remove(key);
		}

		/// <summary>
		/// Gets or sets the value of an item stored in the <see cref="System.Web.UI.StateBag"/>
		/// </summary>
		/// <param name="key">The key for the navigation data item</param>
		/// <returns>The value for navigation data item</returns>
		public object this[string key]
		{
			get
			{
				return Data[key];
			}
			set
			{
				Add(key, value);
			}
		}

#if NET40Plus
		/// <summary>
		/// Gets the dynamic <see cref="Navigation.NavigationData"/>
		/// </summary>
		public dynamic Bag
		{
			get
			{
				if (_DynamicNavigationData == null)
					_DynamicNavigationData = new DynamicNavigationData(this);
				return _DynamicNavigationData;
			}
		}
#endif

		internal void Add(NavigationData data)
		{
			foreach (NavigationDataItem item in data)
			{
				this[item.Key] = item.Value;
			}
		}

		internal void SetDefaults(StateInfoCollection<object> defaults)
		{
			Defaults = defaults;
			Reset();
		}

		private void Reset()
		{
			if (Defaults != null)
			{
				foreach (string key in Defaults.Keys)
				{
					this[key] = this[key];
				}
			}
		}

		/// <summary>
		/// Removes all items from the <see cref="Navigation.NavigationData"/>
		/// </summary>
		public void Clear()
		{
			Data.Clear();
			Reset();
		}

		internal int Count
		{
			get
			{
				return Data.Count;
			}
		}

		bool IStateManager.IsTrackingViewState
		{
			get
			{
				return ((IStateManager)Data).IsTrackingViewState;
			}
		}

		void IStateManager.LoadViewState(object state)
		{
			((IStateManager)Data).LoadViewState(state);
		}

		object IStateManager.SaveViewState()
		{
			return ((IStateManager)Data).SaveViewState();
		}

		void IStateManager.TrackViewState()
		{
			((IStateManager)Data).TrackViewState();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			foreach (NavigationDataItem item in this)
			{
				yield return item;
			}
		}

		/// <summary>
		/// Returns an <see cref="System.Collections.Generic.IEnumerator{T}"/> that iterates through
		/// the <see cref="Navigation.NavigationDataItem"/> elements
		/// </summary>
		/// <returns>An <see cref="System.Collections.Generic.IEnumerator{T}"/> for
		/// the <see cref="Navigation.NavigationData"/></returns>
		public IEnumerator<NavigationDataItem> GetEnumerator()
		{
			foreach(DictionaryEntry entry in Data)
			{
				yield return new NavigationDataItem((string)entry.Key, ((StateItem)entry.Value).Value);
			}
		}

#if NET40Plus
		private class DynamicNavigationData : DynamicObject
		{
			private NavigationData Data
			{
				get;
				set;
			}

			public DynamicNavigationData(NavigationData data)
			{
				Data = data;
			}

			public override bool TryGetMember(GetMemberBinder binder, out object result)
			{
				result = Data[binder.Name];
				return true;
			}

			public override bool TrySetMember(SetMemberBinder binder, object value)
			{
				Data[binder.Name] = value;
				return true;
			}
		}
#endif
	}
}
