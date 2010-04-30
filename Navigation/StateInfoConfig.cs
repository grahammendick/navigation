using System.Configuration;
using System.Globalization;

namespace Navigation
{
	/// <summary>
	/// Provides static access to the <see cref="Navigation.Dialog"/>, <see cref="Navigation.State"/>
	/// and <see cref="Navigation.Transition"/> configuration in the Navigation/StateInfo section
	/// </summary>
	public static class StateInfoConfig
	{
		/// <summary>
		/// Gets a collection of <see cref="Navigation.Dialog"/> information with their child
		/// <see cref="Navigation.State"/> information and grandchild <see cref="Navigation.Transition"/>
		/// information
		/// </summary>
		public static StateInfoCollection<Dialog> Dialogs
		{
			get
			{
				return (StateInfoCollection<Dialog>)ConfigurationManager.GetSection("Navigation/StateInfo");
			}
		}

		internal static string GetStateKey(State state)
		{
			return state.Index.ToString(NumberFormatInfo.InvariantInfo);
		}

		internal static string GetDialogStateKey(State state)
		{
			return state.Parent.Index.ToString(NumberFormatInfo.InvariantInfo) + "-" + state.Index.ToString(NumberFormatInfo.InvariantInfo);
		}
	}
}
