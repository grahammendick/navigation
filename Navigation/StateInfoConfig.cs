using System.Configuration;
using System.Globalization;
using System.Web.Routing;

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

		/// <summary>
		/// Registers all <see cref="Navigation.State.Route"/> configuration information
		/// </summary>
		/// <param name="routes">Route collection</param>
		public static void AddStateRoutes(RouteCollection routes)
		{
			foreach (Dialog dialog in Dialogs)
			{
				foreach (State state in dialog.States)
				{
					if (state.Route.Length != 0)
						routes.MapPageRoute(GetDialogStateKey(state), state.Route, state.Page, state.CheckPhysicalUrlAccess,
							new RouteValueDictionary() { 
								{ StateContext.STATE, GetDialogStateKey(state) }, 
							});
				}
			}
		}
	}
}
