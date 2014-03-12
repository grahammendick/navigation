using System.Collections.Generic;
using System.Linq;

namespace Navigation.Designer
{
	public class Dialog
	{
		private List<StateWrapper> _States = new List<StateWrapper>();

		public List<StateWrapper> States
		{
			get
			{
				return _States;
			}
		}

		public State Initial
		{
			get;
			set;
		}

		public string Key
		{
			get
			{
				return !string.IsNullOrEmpty(Initial.DialogKey) ? Initial.DialogKey : Initial.Key;
			}
		}

		public string Title
		{
			get
			{
				return Initial.DialogTitle;
			}
		}

		public string ResourceType
		{
			get
			{
				return Initial.DialogResourceType;
			}
		}

		public string ResourceKey
		{
			get
			{
				return Initial.DialogResourceKey;
			}
		}

		public string Path
		{
			get
			{
				return Initial.Path;
			}
		}

		public int Order
		{
			get
			{
				return Initial.DialogOrder;
			}
		}

		public Dialog(State initial)
		{
			Initial = initial;
			AddState(new StateWrapper(initial, this));
		}

		public StateWrapper AddState(StateWrapper state)
		{
			StateWrapper otherState = States.Where(s => s.State == state.State).FirstOrDefault();
			if (otherState == null)
				States.Add(state);
			else
				state = otherState;
			return state;
		}
	}
}
