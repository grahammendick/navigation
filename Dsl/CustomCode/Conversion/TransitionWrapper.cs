namespace Navigation.Designer
{
	public class TransitionWrapper
	{
		public StateWrapper To
		{
			get;
			private set;
		}

		public StateWrapper Parent
		{
			get;
			private set;
		}

		public string Key
		{
			get;
			private set;
		}

		public int Order
		{
			get;
			private set;
		}

		public TransitionWrapper(string key, StateWrapper to, StateWrapper parent, int order)
		{
			Key = key;
			To = to;
			Parent = parent;
			Order = order;
		}
	}
}
