using System.Collections.Generic;
using System.Linq;

namespace Navigation.Designer
{
	public class StateWrapper
	{
		private List<TransitionWrapper> _Transitions = new List<TransitionWrapper>();

		public List<TransitionWrapper> Transitions
		{
			get
			{
				return _Transitions;
			}
		}
		public State State
		{
			get;
			private set;
		}

		public Dialog Parent
		{
			get;
			private set;
		}

		public string Key
		{
			get
			{
				return State.Key;
			}
		}

		public string Page
		{
			get
			{
				return State.Page;
			}
		}

		public string Title
		{
			get
			{
				return State.Title;
			}
		}

		public string Route
		{
			get;
			set;
		}

		public bool TrackCrumbTrail
		{
			get
			{
				return State.TrackCrumbTrail;
			}
		}

		public bool CheckPhysicalUrlAccess
		{
			get
			{
				return State.CheckPhysicalUrlAccess;
			}
		}

		public string ResourceType
		{
			get
			{
				return State.ResourceType;
			}
		}

		public string ResourceKey
		{
			get
			{
				return State.ResourceKey;
			}
		}

		public string Theme
		{
			get
			{
				return State.Theme;
			}
		}

		public string Masters
		{
			get
			{
				return State.Masters;
			}
		}

		public string MobilePage
		{
			get
			{
				return State.MobilePage;
			}
		}

		public string MobileRoute
		{
			get
			{
				return State.MobileRoute;
			}
		}

		public string MobileTheme
		{
			get
			{
				return State.MobileTheme;
			}
		}

		public string MobileMasters
		{
			get
			{
				return State.MobileMasters;
			}
		}

		public string Defaults
		{
			get
			{
				return State.Defaults;
			}
		}

		public string DefaultTypes
		{
			get
			{
				return State.DefaultTypes;
			}
		}

		public string Derived
		{
			get
			{
				return State.Derived;
			}
		}

		public int Order
		{
			get
			{
				return State.Order;
			}
		}

		public StateWrapper(State state, Dialog parent)
		{
			State = state;
			Parent = parent;
			Route = state.Route;
		}

		public bool AddTransition(string key, State to, int order)
		{
			if (!CanNavigateTo(to, null))
			{
				Transitions.Add(new TransitionWrapper(key, Parent.AddState(new StateWrapper(to, Parent)), this, order));
				return true;
			}
			return false;
		}

		public bool CanNavigateTo(State state, string key)
		{
			return Transitions.Where(t => t.To.State == state && (key != null ? t.Key == key : true)).FirstOrDefault() != null;
		}
	}
}
