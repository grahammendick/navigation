using System;
using System.Collections;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation
{
	/// <summary>
	/// Supports the <see cref="Navigation.NavigationDataSource"/> and provides an 
	/// interface for data bound controls to select and update <see cref="Navigation.NavigationData"/> 
	/// contained in the <see cref="Navigation.StateContext.Data">State Context</see>
	/// </summary>
	public class NavigationDataSourceView : DataSourceView
	{
		private NavigationDataSource _Owner;
		private HttpContext _Context;
		private ParameterCollection _SelectParameters;
		private ParameterCollection _UpdateParameters;

		/// <summary>
		/// Gets a value of false as only select and update functionality is supported
		/// </summary>
		public override bool CanInsert
		{
			get
			{
				return false;
			}
		}

		/// <summary>
		/// Gets a value of false as only select and update functionality is supported
		/// </summary>
		public override bool CanDelete
		{
			get
			{
				return false;
			}
		}

		/// <summary>
		/// Gets a value of true as <see cref="Navigation.StateContext.Data">State Context</see> update
		/// functionality is supported
		/// </summary>
		public override bool CanUpdate
		{
			get
			{
				return true;
			}
		}

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
		/// Gets the parameters collection used to set <see cref="Navigation.StateContext.Data"/> values
		/// not bound to <see cref="System.Web.UI.Control"/> properties
		/// </summary>
		public ParameterCollection UpdateParameters
		{
			get
			{
				if (_UpdateParameters == null)
				{
					_UpdateParameters = new ParameterCollection();
				}
				return _UpdateParameters;
			}
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationDataSourceView"/>
		/// class
		/// </summary>
		/// <param name="owner">The <see cref="Navigation.NavigationDataSource"/> this view is
		/// associated with</param>
		/// <param name="context">The current <see cref="System.Web.HttpContext"/></param>
		public NavigationDataSourceView(NavigationDataSource owner, HttpContext context)
			: base(owner, "") 
		{
			_Owner = owner;
			_Context = context;
		}

		/// <summary>
		/// Provides access to the current <see cref="Navigation.StateContext.Data">State Context</see>
		/// set with any additional values specified in the <see cref="SelectParameters"/> collection
		/// </summary>
		/// <param name="arguments">This parameter is ignored as <see cref="Navigation.NavigationData"/>
		/// only supports getting values by key</param>
		/// <returns>A copy of the <see cref="Navigation.StateContext.Data">State Context</see></returns>
		protected override IEnumerable ExecuteSelect(DataSourceSelectArguments arguments)
		{
			NavigationData data = new NavigationData(true);
			foreach (DictionaryEntry entry in SelectParameters.GetValues(_Context, _Owner))
			{
				if (data[(string)entry.Key] == null)
					data[(string)entry.Key] = entry.Value;
			}
			yield return data;
		}

		/// <summary>
		/// Updates the current <see cref="Navigation.StateContext.Data">State Context</see> using any
		/// parameters that are supplied in the <see cref="UpdateParameters"/> and <paramref name="values"/>
		/// collections
		/// </summary>
		/// <param name="keys">This parameter is ignored as <see cref="Navigation.NavigationData"/>
		/// only supports getting values by key</param>
		/// <param name="values">A collection of bound <see cref="System.Web.UI.Control"/> property values</param>
		/// <param name="oldValues">This parameter is ignored as <see cref="Navigation.NavigationData"/>
		/// only supports getting values by key</param>
		/// <returns>Returns 0 as irrelevant to return number of updated values</returns>
		protected override int ExecuteUpdate(IDictionary keys, IDictionary values, IDictionary oldValues)
		{
			foreach (DictionaryEntry entry in UpdateParameters.GetValues(_Context, _Owner))
			{
				StateContext.Data[(string)entry.Key] = entry.Value;
			}
			foreach (DictionaryEntry entry in values)
			{
				StateContext.Data[((string)entry.Key).Substring(1, ((string)entry.Key).Length - 2)] = entry.Value;
			}
			return 0;
		}
	}
}
