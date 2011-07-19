using System;
using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation
{
	/// <summary>
	/// Provides paging functionality for any data-bound controls, typically used in conjunction with the
	/// <see cref="System.Web.UI.WebControls.ObjectDataSource"/> control.
	/// </summary>
	public class Pager : DataPager
	{
		NavigationPageableItemContainer _navigationPageableItemContainer = null;

		/// <summary>B
		/// Gets or sets the StartRowIndex <see cref="Navigation.NavigationData"/> key
		/// </summary>
		[Category("Navigation"), Description("The StartRowIndex NavigationData key."), DefaultValue("startRowIndex")]
		public string StartRowIndexKey
		{
			get
			{
				return !string.IsNullOrEmpty((string)ViewState["StartRowIndexKey"]) ? (string)ViewState["StartRowIndexKey"] : "startRowIndex";
			}
			set
			{
				ViewState["StartRowIndexKey"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the MaximumRows <see cref="Navigation.NavigationData"/> key
		/// </summary>
		[Category("Navigation"), Description("The MaximumRows NavigationData key."), DefaultValue("maximumRows")]
		public string MaximumRowsKey
		{
			get
			{
				return !string.IsNullOrEmpty((string)ViewState["MaximumRowsKey"]) ? (string)ViewState["MaximumRowsKey"] : "maximumRows";
			}
			set
			{
				ViewState["MaximumRowsKey"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the TotalRowCount <see cref="Navigation.NavigationData"/> key
		/// </summary>
		[Category("Navigation"), Description("The TotalRowCount NavigationData key."), DefaultValue("totalRowCount")]
		public string TotalRowCountKey
		{
			get
			{
				return !string.IsNullOrEmpty((string)ViewState["TotalRowCountKey"]) ? (string)ViewState["TotalRowCountKey"] : "totalRowCount";
			}
			set
			{
				ViewState["TotalRowCountKey"] = value;
			}
		}

		/// <summary>
		/// Returns a <see cref="System.Web.UI.WebControls.IPageableItemContainer"/> that gets and sets paging
		/// information from <see cref="Navigation.StateContext.Data">Context Data</see>
		/// </summary>
		/// <returns><see cref="System.Web.UI.WebControls.IPageableItemContainer"/> that gets and sets paging
		/// information from <see cref="Navigation.StateContext.Data">Context Data</see></returns>
		protected override IPageableItemContainer FindPageableItemContainer()
		{
			if (_navigationPageableItemContainer == null)
				_navigationPageableItemContainer = new NavigationPageableItemContainer(this);
			return _navigationPageableItemContainer;
		}

		/// <summary>
		/// Raises the <see cref="System.Web.UI.Control.Init"/> event
		/// </summary>
		/// <param name="e">The event data</param>
		protected override void OnInit(EventArgs e)
		{
			base.OnInit(e);
			Page.PreRenderComplete += new EventHandler(Page_PreRenderComplete);
		}

		private void Page_PreRenderComplete(object sender, EventArgs e)
		{
			if (StateContext.Data[TotalRowCountKey] != null)
				OnTotalRowCountAvailable(this, new PageEventArgs(_navigationPageableItemContainer.StartRowIndex, _navigationPageableItemContainer.MaximumRows, _navigationPageableItemContainer.TotalRowCount));
		}

		/// <summary>
		/// Rewrites Urls as Navigation Urls if QueryStringField is populated and adds the attributes of 
		/// a <see cref="Navigation.Pager"/> control to the output stream for rendering 
		/// </summary>
		/// <param name="writer">The output stream to render on the client</param>
		protected override void AddAttributesToRender(HtmlTextWriter writer)
		{
			if (!DesignMode && !string.IsNullOrEmpty(QueryStringField))
				SetNavigationLinks(this);
			base.AddAttributesToRender(writer);
		}

		private void SetNavigationLinks(Control parent)
		{
			HyperLink link;
			int startRowIndex;
			int result;
			string pageNumber;
			foreach (Control control in parent.Controls)
			{
				link = control as HyperLink;
				if (link != null)
				{
					pageNumber = null;
					startRowIndex = 0;
					if (link.NavigateUrl.IndexOf("?", StringComparison.Ordinal) >= 0)
						pageNumber = HttpUtility.ParseQueryString(link.NavigateUrl.Substring(link.NavigateUrl.IndexOf("?", StringComparison.Ordinal)))[QueryStringField];
					if (pageNumber != null)
					{
						if (int.TryParse(pageNumber, out result))
							startRowIndex = (result - 1) * MaximumRows;
						NavigationData data = new NavigationData(true);
						data[StartRowIndexKey] = null;
						if (startRowIndex != 0)
							data[StartRowIndexKey] = startRowIndex;
						data[MaximumRowsKey] = null;
						if (MaximumRows != 10)
							data[MaximumRowsKey] = MaximumRows;
						link.NavigateUrl = StateController.GetRefreshLink(data);
					}
				}
				SetNavigationLinks(control);
			}
		}

		private class NavigationPageableItemContainer : IPageableItemContainer
		{
			public event EventHandler<PageEventArgs> TotalRowCountAvailable;

			private Pager Pager
			{
				get;
				set;
			}

			public NavigationPageableItemContainer(Pager pager)
			{
				Pager = pager;
			}

			#region IPageableItemContainer Members

			public void SetPageProperties(int startRowIndex, int maximumRows, bool databind)
			{
				if (Pager.Page.IsPostBack || StateContext.Data[Pager.StartRowIndexKey] == null)
					StartRowIndex = startRowIndex;
				if (Pager.Page.IsPostBack || StateContext.Data[Pager.MaximumRowsKey] == null)
					MaximumRows = maximumRows;
				if (StateContext.Data[Pager.TotalRowCountKey] != null && TotalRowCountAvailable != null)
					TotalRowCountAvailable(this, new PageEventArgs(StartRowIndex, MaximumRows, TotalRowCount));
			}

			public int TotalRowCount
			{
				get
				{
					return (int)StateContext.Data[Pager.TotalRowCountKey];
				}
			}

			public int MaximumRows
			{
				get
				{
					return StateContext.Data[Pager.MaximumRowsKey] != null ? (int)StateContext.Data[Pager.MaximumRowsKey] : 10;
				}
				private set
				{
					StateContext.Data[Pager.MaximumRowsKey] = null;
					if (value != 10)
						StateContext.Data[Pager.MaximumRowsKey] = value;
				}
			}

			public int StartRowIndex
			{
				get
				{
					return StateContext.Data[Pager.StartRowIndexKey] != null ? (int)StateContext.Data[Pager.StartRowIndexKey] : 0;
				}
				private set
				{
					StateContext.Data[Pager.StartRowIndexKey] = null;
					if (value != 0)
						StateContext.Data[Pager.StartRowIndexKey] = value;
				}
			}

			#endregion
		}
	}
}
