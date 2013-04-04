using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Web.UI;
using Navigation.Properties;

namespace Navigation
{
	/// <summary>
	/// Provides history navigation functionality, adding a history point whenever an item
	/// in <see cref="Navigation.NavigationData"/> changes
	/// </summary>
	public class HistoryNavigator : Control
	{
		private ScriptManager _ScriptManager;

		/// <summary>
		/// Gets or sets a comma separated list of <see cref="Navigation.NavigationData"/> items to track
		/// for changes
		/// </summary>
		[Category("Behavior"), Description("Comma separated list of NavigationData items to track for changes."), DefaultValue("")]
		public string HistoryKeys
		{
			get
			{
				return ViewState["HistoryKeys"] != null ? (string)ViewState["HistoryKeys"] : string.Empty;
			}
			set
			{
				ViewState["HistoryKeys"] = value;
			}
		}

		private NavigationData OriginalData
		{
			get;
			set;
		}

		private NavigationData Data
		{
			get
			{
				List<string> keys = null;
				if (HistoryKeys.Length != 0)
				{
					keys = new List<string>();
					foreach (string key in HistoryKeys.Split(new char[] { ',' }))
					{
						keys.Add(key.Trim());
					}
				}
				NavigationData data = new NavigationData();
				foreach (NavigationDataItem item in StateContext.Data)
				{
					if (keys == null || keys.Contains(item.Key))
						data[item.Key] = item.Value;
				}
				return data;
			}
		}

		private NavigationData ChangedData
		{
			get
			{
				NavigationData currentData = Data;
				if (OriginalData.Count != currentData.Count)
					return currentData;
				foreach (NavigationDataItem item in OriginalData)
				{
					if (!item.Value.Equals(currentData[item.Key]))
						return currentData;
				}
				return null;
			}
		}

		private ScriptManager ScriptManager
		{
			get
			{
				if (_ScriptManager == null)
				{
					_ScriptManager = ScriptManager.GetCurrent(Page);
					if (_ScriptManager == null)
						throw new InvalidOperationException(string.Format(CultureInfo.CurrentCulture, Resources.ScriptManagerMissing));
				}
				return _ScriptManager;
			}
		}

		/// <summary>
		/// Raises the <see cref="System.Web.UI.Control.Init"/> event
		/// </summary>
		/// <param name="e">The event data</param>
		protected override void OnInit(EventArgs e)
		{
			base.OnInit(e);
			Page.PreLoad += Page_PreLoad;
			if (!DesignMode)
				ScriptManager.Navigate += HistoryNavigator_Navigate;
		}

		private void Page_PreLoad(object sender, EventArgs e)
		{
			OriginalData = Data;
		}

		private void HistoryNavigator_Navigate(object sender, HistoryEventArgs e)
		{
			if (ScriptManager.IsInAsyncPostBack)
			{
				StateController.NavigateHistory(e.State);
			}
		}

		/// <summary>
		/// Raises the <see cref="System.Web.UI.Control.OnPreRender"/> event
		/// </summary>
		/// <param name="e">The event data</param>
		protected override void OnPreRender(EventArgs e)
		{
			base.OnPreRender(e);
			NavigationData data = ChangedData;
			if (data != null && ScriptManager.IsInAsyncPostBack && !ScriptManager.IsNavigating)
				StateController.AddHistoryPoint(Page, data, null);
		}
	}
}