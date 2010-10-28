using System;
using System.Threading;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// Configures dialog information contained in the Navigation/StateInfo section. Represents 
	/// a logical grouping of child <see cref="Navigation.State"/> elements. Navigating across
	/// different dialogs will initialise the crumb trail
	/// </summary>
	[Serializable]
    public class Dialog
    {
        private StateInfoCollection<State> _States = new StateInfoCollection<State>();
		private int _Index;
        private State _Initial;
        private string _Key;
        private string _Title;
		private string _ResourceType;
		private string _ResourceKey;
		private string _Path;

		/// <summary>
		/// Gets the <see cref="Navigation.State"/> children
		/// </summary>
        public StateInfoCollection<State> States
        {
            get
            {
                return _States;
            }
        }

		/// <summary>
		/// Gets the number of the dialog as read sequentially from the configuration section
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
		/// Gets the state to navigate to if the <see cref="Key"/> is passed as an action parameter
		/// to the <see cref="Navigation.StateController"/>
		/// </summary>
        public State Initial
        {
            get
            {
                return _Initial;
            }
            internal set
            {
                _Initial = value;
            }
        }

		/// <summary>
		/// Gets the key, unique across dialogs, which is passed as the action
		/// parameter to the <see cref="Navigation.StateController"/> when navigating
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
		/// Gets the textual description of the dialog. The resourceType and resourceKey attributes can be 
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
		/// Gets the Url that will cause a navigation to the <see cref="Initial"/> state. It should not
		/// contain a query string although browsing to the Url with a query string will work and will pass
		/// the query string data as per normal <see cref="Navigation.NavigationData"/>
		/// </summary>
		public string Path
		{
			get
			{
				return _Path;
			}
			internal set
			{
				_Path = value;
			}
		}
	}
}
