#if NET35Plus
using System;
using System.Collections.Specialized;
using System.Globalization;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;

namespace Navigation
{
	/// <summary>
	/// Manages all navigation. These can be forward using an action parameter; backward via
	/// a <see cref="Navigation.Crumb"/>; refreshing the current <see cref="Navigation.State"/>;
	/// or adding/restoring a history point
	/// </summary>
	public partial class StateController
	{
		private const string HISTORY_URL_VAR = "var {0} = {1};";
		private const string HISTORY_URL = "n1";

		/// <summary>
		/// Wraps the ASP.NET <see cref="System.Web.UI.ScriptManager"/> history point functionality.
		/// Adds a history point passing no <see cref="Navigation.NavigationData"/>
		/// </summary>
		/// <param name="page">Current <see cref="System.Web.UI.Page"/></param>
		/// <param name="title">Title for history point</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="page"/> is null</exception>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static void AddHistoryPoint(Page page, string title)
		{
			AddHistoryPoint(page, null, title);
		}

		/// <summary>
		/// Wraps the ASP.NET <see cref="System.Web.UI.ScriptManager"/> history point functionality.
		/// </summary>
		/// <param name="page">Current <see cref="System.Web.UI.Page"/></param>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> used to create the history point</param>
		/// <param name="title">Title for history point</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="page"/> is null</exception>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static void AddHistoryPoint(Page page, NavigationData toData, string title)
		{
			if (page == null)
				throw new ArgumentNullException("page");
			NameValueCollection coll = new NameValueCollection();
			coll[NavigationSettings.Config.StateIdKey] = StateContext.StateId;
			foreach (NavigationDataItem item in toData)
			{
				if (!item.Value.Equals(string.Empty) && !StateContext.State.DefaultOrDerived(item.Key, item.Value))
					coll[item.Key] = CrumbTrailManager.FormatURLObject(item.Key, item.Value, StateContext.State);
			}
			coll = StateContext.ShieldEncode(coll, true, StateContext.State);
			ScriptManager.GetCurrent(page).AddHistoryPoint(coll, title);
			ScriptManager.RegisterClientScriptBlock(page, typeof(StateController), "historyUrl", string.Format(CultureInfo.InvariantCulture, HISTORY_URL_VAR, HISTORY_URL, new JavaScriptSerializer().Serialize(GetRefreshLink(toData))), true);
		}

		/// <summary>
		/// Responds to a <see cref="System.Web.UI.ScriptManager"/> history navigation handler and restores the
		/// <paramref name="data"/> saved by <see cref="AddHistoryPoint(System.Web.UI.Page, Navigation.NavigationData, string)"/> 
		/// method to the <see cref="Navigation.StateContext"/>
		/// </summary>
		/// <param name="data">Saved <see cref="Navigation.StateContext"/> to restore</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="data"/> is null</exception>
		/// <exception cref="Navigation.UrlException">There is data that cannot be converted from a <see cref="System.String"/>;
		/// or the <see cref="Navigation.NavigationShield"/> detects tampering</exception>
		public static void NavigateHistory(NameValueCollection data)
		{
			if (data == null)
				throw new ArgumentNullException("data");
			if (data.Count == 0)
			{
				NavigationData derivedData = new NavigationData(StateContext.State.Derived);
#if NET40Plus
				SetStateContext(StateContext.State.Id, new HttpContextWrapper(HttpContext.Current));
#else
				SetStateContext(StateContext.State.Id, HttpContext.Current.Request.QueryString);
#endif
				StateContext.Data.Add(derivedData);
			}
			else
			{
				RemoveDefaultsAndDerived(data);
				data = StateContext.ShieldDecode(data, true, StateContext.State);
				data.Remove(NavigationSettings.Config.StateIdKey);
				NavigationData derivedData = new NavigationData(StateContext.State.Derived);
				StateContext.Data.Clear();
				StateContext.Data.Add(derivedData);
				foreach (string key in data)
				{
					StateContext.Data[key] = CrumbTrailManager.ParseURLString(key, data[key], StateContext.State);
				}
			}
		}
	}
}
#endif