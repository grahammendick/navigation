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
		/// Gets the parameters collection used to set default values to help with binding to 
		/// non-nullable <see cref="System.Web.UI.Control"/> properties
		/// </summary>
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ParameterCollection SelectParameters
		{
			get { return GetView().SelectParameters; }
		}

		/// <summary>
		/// Gets the parameters collection used to set <see cref="Navigation.StateContext.Data"/> values
		/// not bound to <see cref="System.Web.UI.Control"/> properties
		/// </summary>
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ParameterCollection UpdateParameters
		{
			get { return GetView().UpdateParameters; }
		}

		private NavigationDataSourceView GetView()
		{
			if (_View == null)
			{
				_View = new NavigationDataSourceView(this, Context);
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
	}
}
