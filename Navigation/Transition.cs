using System;

namespace Navigation
{
	/// <summary>
	/// Configures transition information contained in the Navigation/StateInfo section. A child
	/// of a <see cref="Navigation.State"/> element it represents a possible navigation from its 
	/// <see cref="Parent"/> to a sibling <see cref="Navigation.State"/>
	/// </summary>
	[Serializable]
	public class Transition
	{
		private State _To;
		private State _Parent;
		private int _Index;
		private string _Key;

		/// <summary>
		/// Gets the state to navigate to if the <see cref="Key"/> is passed as an action parameter
		/// to the <see cref="Navigation.StateController"/>
		/// </summary>
		public State To
		{
			get
			{
				return _To;
			}
			internal set
			{
				_To = value;
			}
		}

		/// <summary>
		/// Gets the parent <see cref="Navigation.State"/> configuration item
		/// </summary>
		public State Parent
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
		/// Gets the number of the transition within its <see cref="Parent"/> as read
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
		/// Gets the key, unique within a <see cref="Parent"/>, which is passed as the action
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
	}
}
