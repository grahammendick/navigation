using System;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Threading;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// Configures state information contained in the Navigation/StateInfo section. A child
	/// of a <see cref="Navigation.Dialog"/> element it represents a <see cref="System.Web.UI.Page"/>
	/// that can be visisted
	/// </summary>
	[Serializable]
	public class State
	{
		private StateInfoCollection<Transition> _Transitions = new StateInfoCollection<Transition>();
		private Dialog _Parent;
		private int _Index;
		private string _Key;
		private string _Page;
		private string _MobilePage;
		private StateInfoCollection<Type> _DefaultTypes;
		private StateInfoCollection<object> _Defaults;
		private StateInfoCollection<string> _FormattedDefaults;
		private string _Title;
		private string _Route;
		private string _MobileRoute;
		private bool _TrackCrumbTrail;
		private bool _CheckPhysicalUrlAccess;
		private string _ResourceType;
		private string _ResourceKey;
		private string _Theme;
		private string _MobileTheme;
		private ReadOnlyCollection<string> _Masters;
		private ReadOnlyCollection<string> _MobileMasters;

		/// <summary>
		/// Gets the <see cref="Navigation.Transition"/> children
		/// </summary>
		public StateInfoCollection<Transition> Transitions
		{
			get
			{
				return _Transitions;
			}
		}

		/// <summary>
		/// Gets the parent <see cref="Navigation.Dialog"/> configuration item
		/// </summary>
		public Dialog Parent
		{
			get
			{
				return _Parent;
			}
			internal set
			{
				_Parent = value;
			}
		}

		/// <summary>
		/// Gets the number of the state within its <see cref="Parent"/> as read
		/// sequentially from the configuration section
		/// </summary>
		public int Index
		{
			get
			{
				return _Index;
			}
			internal set
			{
				_Index = value;
			}
		}

		/// <summary>
		/// Gets the key, unique within a <see cref="Parent"/>, used by <see cref="Navigation.Dialog"/>
		/// and <see cref="Navigation.Transition"/> elements to specify navigation configuration
		/// </summary>
		public string Key
		{
			get
			{
				return _Key;
			}
			internal set
			{
				_Key = value;
			}
		}

		/// <summary>
		/// Gets the aspx page to display when navigating to this <see cref="Navigation.State"/>
		/// </summary>
		public string Page
		{
			get
			{
				return _Page;
			}
			internal set
			{
				_Page = value;
			}
		}

		/// <summary>
		/// Gets the aspx page to display for a mobile device navigating to this <see cref="Navigation.State"/>
		/// </summary>
		public string MobilePage
		{
			get
			{
				return _MobilePage;
			}
			internal set
			{
				_MobilePage = value;
			}
		}

		/// <summary>
		/// Gets the default <see cref="Navigation.NavigationData"/> <see cref="System.Type"/>'s for 
		/// this <see cref="Navigation.State"/>
		/// </summary>
		public StateInfoCollection<Type> DefaultTypes
		{
			get
			{
				return _DefaultTypes;
			}
			internal set
			{
				_DefaultTypes = value;
			}
		}

		/// <summary>
		/// Gets the default <see cref="Navigation.NavigationData"/> for this <see cref="Navigation.State"/>
		/// </summary>
		public StateInfoCollection<object> Defaults
		{
			get
			{
				return _Defaults;
			}
			internal set
			{
				_Defaults = value;
			}
		}

		internal StateInfoCollection<string> FormattedDefaults
		{
			get
			{
				return _FormattedDefaults;
			}
			set
			{
				_FormattedDefaults = value;
			}
		}

		/// <summary>
		/// Gets the textual description of the state. The resourceType and resourceKey attributes can be 
		/// used for localization
		/// </summary>
		public string Title
		{
			get
			{
				if (ResourceKey.Length != 0)
				{
					return (string)HttpContext.GetGlobalResourceObject(ResourceType, ResourceKey, Thread.CurrentThread.CurrentUICulture);
				}
				return _Title;
			}
			internal set
			{
				_Title = value;
			}
		}

		/// <summary>
		/// Gets the route Url pattern
		/// </summary>
		public string Route
		{
			get
			{
				return _Route;
			}
			internal set
			{
				_Route = value;
			}
		}

		/// <summary>
		/// Gets the mobile device route Url pattern
		/// </summary>
		public string MobileRoute
		{
			get
			{
				return _MobileRoute;
			}
			internal set
			{
				_MobileRoute = value;
			}
		}

		/// <summary>
		/// Gets a value that indicates whether to maintain crumb trail information 
		/// e.g <see cref="Navigation.StateContext.PreviousState"/>. This can be used together 
		/// with <see cref="Route"/> to produce user friendly Urls
		/// </summary>
		public bool TrackCrumbTrail
		{
			get
			{
				return _TrackCrumbTrail;
			}
			internal set
			{
				_TrackCrumbTrail = value;
			}
		}

		/// <summary>
		/// Gets a value that indicates whether ASP.NET should validate that the user has authority to access the 
		/// physical <see cref="Page"/>. This is only relevant if <see cref="Route"/> or <see cref="MobileRoute"/>
		/// is set
		/// </summary>
		public bool CheckPhysicalUrlAccess
		{
			get
			{
				return _CheckPhysicalUrlAccess;
			}
			internal set
			{
				_CheckPhysicalUrlAccess = value;
			}
		}

		internal string ResourceType
		{
			get
			{
				return _ResourceType;
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
				return _ResourceKey;
			}
			set
			{
				_ResourceKey = value;
			}
		}

		/// <summary>
		/// Gets the theme to assign to the <see cref="Page"/> when displayed
		/// </summary>
		public string Theme
		{
			get
			{
				return _Theme;
			}
			internal set
			{
				_Theme = value;
			}
		}

		/// <summary>
		/// Gets the theme to assign to the <see cref="Page"/> when displayed for a mobile device
		/// </summary>
		public string MobileTheme
		{
			get
			{
				return _MobileTheme;
			}
			internal set
			{
				_MobileTheme = value;
			}
		}

		/// <summary>
		/// Gets the master pages to assign to the <see cref="Page"/> when displayed
		/// </summary>
		public ReadOnlyCollection<string> Masters
		{
			get
			{
				return _Masters;
			}
			internal set
			{
				_Masters = value;
			}
		}

		/// <summary>
		/// Gets the master pages to assign to the <see cref="Page"/> when displayed for a mobile device
		/// </summary>
		public ReadOnlyCollection<string> MobileMasters
		{
			get
			{
				return _MobileMasters;
			}
			internal set
			{
				_MobileMasters = value;
			}
		}

		internal string StateKey
		{
			get
			{
				return Index.ToString(NumberFormatInfo.InvariantInfo);
			}
		}

		internal string DialogStateKey
		{
			get
			{
				return Parent.Index.ToString(NumberFormatInfo.InvariantInfo) + "-" + Index.ToString(NumberFormatInfo.InvariantInfo);
			}
		}

		internal bool MobileOverride
		{
			get
			{
				return MobilePage.Length != 0 || MobileRoute.Length != 0 || MobileMasters.Count != 0 || MobileTheme.Length != 0;
			}
		}

		internal string GetPage(bool mobile)
		{
			return (!mobile || MobilePage.Length == 0) ? Page : MobilePage;
		}

		internal string GetRoute(bool mobile)
		{
			return (!mobile || (MobilePage.Length == 0 && MobileRoute.Length == 0)) ? Route : MobileRoute;
		}

		internal string GetRouteName(bool mobile)
		{
			return (!mobile || (MobilePage.Length == 0 && MobileRoute.Length == 0)) ? DialogStateKey : "Mobile" + DialogStateKey;
		}

		internal ReadOnlyCollection<string> GetMasters(bool mobile)
		{
			return (!mobile || (MobilePage.Length == 0 && MobileMasters.Count == 0)) ? Masters : MobileMasters;
		}

		internal string GetTheme(bool mobile)
		{
			return (!mobile || (MobilePage.Length == 0 && MobileTheme.Length == 0)) ? Theme : MobileTheme;
		}
	}
}
