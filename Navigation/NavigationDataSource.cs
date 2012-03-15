using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation
{
	/// <summary>
	/// Provides a data source control that a <see cref="System.Web.UI.Control"/> can use to bind
	/// to the <see cref="Navigation.NavigationData"/> contained in the 
	/// <see cref="Navigation.StateContext.Data">State Context</see>. Select and update functionality
	/// is supported
	/// </summary>
	[ParseChildren(true)]
	public class NavigationDataSource : DataSourceControl
	{
		private NavigationDataSourceView _View;

		/// <summary>
		/// Gets or sets a value indicating whether bound values passed during an update should 
		/// be converted to null if they are <see cref="System.String.Empty"/>.
		/// This is ignored for <see cref="UpdateParameters"/> as their own 
		/// <see cref="System.Web.UI.WebControls.Parameter.ConvertEmptyStringToNull"/> value
		/// will be used instead
		/// </summary>
		[DefaultValue(true), Category("Data"), Description("Specifies whether empty string bound values passed during an update will be converted to null.")]
		public bool ConvertEmptyStringToNull
		{
			get
			{
				return GetView().ConvertEmptyStringToNull;
			}
			set
			{
				GetView().ConvertEmptyStringToNull = value;
			}
		}

		/// <summary>
		/// Gets the parameters collection used to set default values to help with binding to 
		/// non-nullable <see cref="System.Web.UI.Control"/> properties
		/// </summary>
		[PersistenceMode(PersistenceMode.InnerProperty), Category("Data"), Description("Collection of parameters used to set default Control properties.")]
		public ParameterCollection SelectParameters
		{
			get { return GetView().SelectParameters; }
		}

		/// <summary>
		/// Gets the parameters collection used to set <see cref="Navigation.StateContext.Data"/> values
		/// not bound to <see cref="System.Web.UI.Control"/> properties
		/// </summary>
		[PersistenceMode(PersistenceMode.InnerProperty), Category("Data"), Description("Collection of parameters used to set default NavigationData values.")]
		public ParameterCollection UpdateParameters
		{
			get { return GetView().UpdateParameters; }
		}

		private NavigationDataSourceView GetView()
		{
			if (_View == null)
			{
				_View = new NavigationDataSourceView(this, Context);
				if (IsTrackingViewState)
					_View.TrackViewState();
			}
			return _View;
		}

		/// <summary>
		/// Retrieves the named data source view that is associated with the data source control
		/// </summary>
		/// <param name="viewName">This parameter is ignored as only one view is supported</param>
		/// <returns>An associated <see cref="Navigation.NavigationDataSourceView"/></returns>
		protected override DataSourceView GetView(string viewName)
		{
			return GetView();
		}

		/// <summary>
		/// Adds a <see cref="System.Web.UI.Page.LoadComplete"/> event handler to the page that contains
		/// the <see cref="Navigation.NavigationDataSource"/> control
		/// </summary>
		/// <param name="e">An <see cref="System.EventArgs"/> that contains event data</param>
		protected override void OnInit(EventArgs e)
		{
			base.OnInit(e);
			if (Page != null)
				Page.LoadComplete += Page_LoadComplete;
		}

		private void Page_LoadComplete(object sender, EventArgs e)
		{
			SelectParameters.UpdateValues(Context, this);
		}

		/// <summary>
		/// Loads the previously saved view state of the <see cref="Navigation.NavigationDataSource"/>
		/// and its associated <see cref="Navigation.NavigationDataSourceView"/>
		/// </summary>
		/// <param name="savedState">The saved view state values for the control</param>
		protected override void LoadViewState(object savedState)
		{
			if (savedState == null)
			{
				base.LoadViewState(null);
			}
			else
			{
				Pair pair = (Pair)savedState;
				base.LoadViewState(pair.First);
				GetView().LoadViewState(pair.Second);
			}
		}

		/// <summary>
		/// Saves the view state of the <see cref="Navigation.NavigationDataSource"/> and its
		/// associated <see cref="Navigation.NavigationDataSourceView"/>
		/// </summary>
		/// <returns>Returns the view state of the <see cref="Navigation.NavigationDataSource"/>
		/// and its associated <see cref="Navigation.NavigationDataSourceView"/></returns>
		protected override object SaveViewState()
		{
			Pair pair = new Pair {
				First = base.SaveViewState()
			};
			if (_View != null)
				pair.Second = _View.SaveViewState();
			if (pair.First == null && pair.Second == null)
				return null;
			return pair;
		}

		/// <summary>
		/// Tracks view state changes of the <see cref="Navigation.NavigationDataSource"/> and its
		/// associated <see cref="Navigation.NavigationDataSourceView"/>
		/// </summary>
		protected override void TrackViewState()
		{
			base.TrackViewState();
			if (_View != null)
				_View.TrackViewState();
		}
	}
}
