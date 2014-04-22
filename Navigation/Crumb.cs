namespace Navigation
{
	/// <summary>
	/// Represents one piece of the crumb trail and holds the information need to return to and recreate 
	/// the <see cref="Navigation.State"/> as previously visited. In a single crumb trail no two crumbs
	/// can have the same <see cref="State"/> but all must have the same <see cref="Navigation.Dialog"/>
	/// </summary>
	public class Crumb
	{
		private string _NavigationLink;
		private NavigationData _Data;
		private State _State;
		private bool _Last;

		/// <summary>
		/// Gets the hyperlink navigation to return to the <see cref="State"/> and pass
		/// the associated <see cref="Data"/>
		/// </summary>
		public string NavigationLink
		{
			get
			{
				return _NavigationLink;
			}
		}

		/// <summary>
		/// Gets the <see cref="Navigation.StateContext.Data">Context Data</see> held at the time of navigating
		/// away from this <see cref="State"/>
		/// </summary>
		public NavigationData Data
		{
			get
			{
				return _Data;
			}
		}

#if NET40Plus
		/// <summary>
		/// Gets the dynamic <see cref="Navigation.NavigationData.Bag"/> for the <see cref="Data"/>
		/// </summary>
		public dynamic Bag
		{
			get
			{
				return Data.Bag;
			}
		}
#endif

		/// <summary>
		/// Gets values from <see cref="Data"/> for the specified <paramref name="key"/>.
		/// A convenience property used in conjunction with <see cref="Navigation.CrumbTrailDataSource"/> 
		/// when data binding
		/// </summary>
		/// <param name="key">Key to the <see cref="Navigation.NavigationData"/> item</param>
		/// <returns>Value of the <see cref="Navigation.NavigationData"/> item</returns>
		public object this[string key]
		{
			get
			{
				return Data[key];
			}
		}

		/// <summary>
		/// Gets the configuration information associated with this navigation
		/// </summary>
		public State State
		{
			get
			{
				return _State;
			}
		}

		/// <summary>
		/// Gets the <see cref="State"/> Title. A convenience property  used in conjunction
		/// with <see cref="Navigation.CrumbTrailDataSource"/> when data binding
		/// </summary>
		public string Title
		{
			get
			{
				return State.Title;
			}
		}

		/// <summary>
		/// Gets a value indicating whether the <see cref="Navigation.Crumb"/> is the last in the crumb trail
		/// </summary>
		public bool Last
		{
			get
			{
				return _Last;
			}
		}

		internal Crumb(string href, NavigationData data, State state, bool last)
		{
			_NavigationLink = href;
			_Data = data ?? new NavigationData();
			_State = state;
			_Last = last;
			Data.SetDefaults(State.Defaults);
		}
	}
}
