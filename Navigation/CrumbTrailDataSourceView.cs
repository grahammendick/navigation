using System;
using System.Collections;
using System.Web.UI;

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
		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.CrumbTrailDataSourceView"/>
		/// class
		/// </summary>
		/// <param name="owner">The <see cref="Navigation.CrumbTrailDataSource"/> this view is
		/// associated with</param>
		public CrumbTrailDataSourceView(CrumbTrailDataSource owner)
			: base(owner, "") 
		{
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
		/// Iterates through the <see cref="Navigation.Crumb"/> contents of <see cref="Navigation.StateController.Crumbs"/>
		/// </summary>
		/// <param name="arguments">This parameter is ignored</param>
		/// <returns>An <see cref="System.Collections.IEnumerable"/> list of <see cref="Navigation.Crumb"/> items</returns>
		protected override IEnumerable ExecuteSelect(DataSourceSelectArguments arguments)
		{
			foreach (Crumb crumb in StateController.Crumbs)
				yield return crumb;
		}
	}
}
