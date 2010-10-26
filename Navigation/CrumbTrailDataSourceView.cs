using System.Collections;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation
{
	/// <summary>
	/// Supports the <see cref="Navigation.CrumbTrailDataSource"/> and provides an interface for data
	/// bound controls to display a crumb trail. A crumb trail is a <see cref="Navigation.Crumb"/> list with
	/// each crumb representing the <see cref="Navigation.State"/> and <see cref="Navigation.NavigationData"/>
	/// required to return to and recreate the <see cref="System.Web.UI.Page"/> as previously visited
	/// </summary>
	public class CrumbTrailDataSourceView : DataSourceView
	{
		private CrumbTrailDataSource _Owner;
		private HttpContext _Context;
		private ParameterCollection _SelectParameters;

		/// <summary>
		/// Gets the parameters collection used to set default values to help with binding to 
		/// non-nullable <see cref="System.Web.UI.Control"/> properties
		/// </summary>
		public ParameterCollection SelectParameters
		{
			get
			{
				if (_SelectParameters == null)
				{
					_SelectParameters = new ParameterCollection();
				}
				return _SelectParameters;
			}
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.CrumbTrailDataSourceView"/>
		/// class
		/// </summary>
		/// <param name="owner">The <see cref="Navigation.CrumbTrailDataSource"/> this view is
		/// associated with</param>
		/// <param name="context">The current <see cref="System.Web.HttpContext"/></param>
		public CrumbTrailDataSourceView(CrumbTrailDataSource owner, HttpContext context)
			: base(owner, "") 
		{
			_Owner = owner;
			_Context = context;
		}

		/// <summary>
		/// Gets a value of false as only select functionality is supported
		/// </summary>
		public override bool CanInsert
		{
			get
			{
				return false;
			}
		}

		/// <summary>
		/// Gets a value of false as only select functionality is supported
		/// </summary>
		public override bool CanDelete
		{
			get
			{
				return false;
			}
		}

		/// <summary>
		/// Gets a value of false as only select functionality is supported
		/// </summary>
		public override bool CanUpdate
		{
			get
			{
				return false;
			}
		}

		/// <summary>
		/// Iterates through the <see cref="Navigation.Crumb"/> contents of <see cref="Navigation.StateController.Crumbs"/>,
		/// each one is set with any additional values specified in the <see cref="SelectParameters"/> collection
		/// </summary>
		/// <param name="arguments">This parameter is ignored</param>
		/// <returns>An <see cref="System.Collections.IEnumerable"/> list of <see cref="Navigation.Crumb"/> items</returns>
		protected override IEnumerable ExecuteSelect(DataSourceSelectArguments arguments)
		{
			foreach (Crumb crumb in StateController.Crumbs)
			{
				foreach (DictionaryEntry entry in SelectParameters.GetValues(_Context, _Owner))
				{
					if (crumb.Data[(string)entry.Key] == null)
						crumb.Data[(string)entry.Key] = entry.Value;
				}
				yield return crumb;
			}
		}
	}
}
