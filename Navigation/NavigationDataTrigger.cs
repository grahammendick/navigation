using System.Web.UI;

namespace Navigation
{
	/// <summary>
	/// Defines a <see cref="Navigation.NavigationData"/> item as a trigger so that when it changes
	/// it causes an <see cref="System.Web.UI.UpdatePanel"/> to refresh
	/// </summary>
	public class NavigationDataTrigger : UpdatePanelTrigger
	{
		/// <summary>
		/// Gets or sets the key of the <see cref="Navigation.NavigationData"/> item
		/// </summary>
		public string Key
		{
			get;
			set;
		}

		private object Value
		{
			get;
			set;
		}

		/// <summary>
		/// Returns a value indicating whether the <see cref="Navigation.NavigationData"/> item identified by
		/// the <see cref="Key"/> has changed
		/// </summary>
		/// <returns>True if the item has changed; false otherwise</returns>
		protected override bool HasTriggered()
		{
			return Value == null ? StateContext.Data[Key] != null : !Value.Equals(StateContext.Data[Key]);
		}

		/// <summary>
		/// Stores the initial value of the <see cref="Navigation.NavigationData"/> item identified by
		/// the <see cref="Key"/>
		/// </summary>
		protected override void Initialize()
		{
			Value = StateContext.Data[Key];
		}
	}
}
