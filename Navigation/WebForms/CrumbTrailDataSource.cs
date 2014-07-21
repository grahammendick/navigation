using System.Web.UI;

namespace Navigation
{
	/// <summary>
	/// Provides a data source control that a <see cref="System.Web.UI.Control"/> can use to bind
	/// to crumb trail data. A crumb trail is a <see cref="Navigation.Crumb"/> list with each crumb
	/// representing the <see cref="Navigation.State"/> and <see cref="Navigation.NavigationData"/>
	/// required to return to and recreate the <see cref="System.Web.UI.Page"/> as previously visited
	/// </summary>
	public class CrumbTrailDataSource : DataSourceControl
	{
		private CrumbTrailDataSourceView _View;

		private CrumbTrailDataSourceView GetView()
		{
			if (_View == null)
			{
				_View = new CrumbTrailDataSourceView(this);
			}
			return _View;
		}

		/// <summary>
		/// Retrieves the named data source view that is associated with the data source control
		/// </summary>
		/// <param name="viewName">This parameter is ignored as only one view is supported</param>
		/// <returns>An associated <see cref="Navigation.CrumbTrailDataSourceView"/></returns>
		protected override DataSourceView GetView(string viewName)
		{
			return GetView();
		}
	}
}
