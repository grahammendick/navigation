using System;
using System.Collections.ObjectModel;
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
        private string _Title;
		private string _ResourceType;
		private string _ResourceKey;
        private string _Theme;
		private ReadOnlyCollection<string> _Masters;

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
    }
}
