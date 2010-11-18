using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation
{
	/// <summary>
	/// Provides a data source control that a <see cref="System.Web.UI.Control"/> can use to bind
	/// to crumb trail data. A crumb trail is a <see cref="Navigation.Crumb"/> list with each crumb
	/// representing the <see cref="Navigation.State"/> and <see cref="Navigation.NavigationData"/>
	/// required to return to and recreate the <see cref="System.Web.UI.Page"/> as previously visited
	/// </summary>
	[ParseChildren(true)]
	public class CrumbTrailDataSource : DataSourceControl
	{
		private CrumbTrailDataSourceView _View;

		/// <summary>
		/// Gets the parameters collection used to set default values to help with binding to 
		/// non-nullable <see cref="System.Web.UI.Control"/> properties
		/// </summary>
		[PersistenceMode(PersistenceMode.InnerProperty), Category("Data"), Description("Collection of parameters used to set default Control properties.")]
		public ParameterCollection SelectParameters
		{
			get { return GetView().SelectParameters; }
		}

		private CrumbTrailDataSourceView GetView()
		{
			if (_View == null)
			{
				_View = new CrumbTrailDataSourceView(this, Context);
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
