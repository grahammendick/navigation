using System;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Configuration;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Web;
using System.Web.UI;
using Navigation.Properties;

namespace Navigation
{
	/// <summary>
	/// Manages all navigation. These can be forward using an action parameter; backward via
	/// a <see cref="Navigation.Crumb"/>; refreshing the current <see cref="Navigation.State"/>;
	/// or adding/restoring a history point.
	/// </summary>
	public static class StateController
	{
		/// <summary>
		/// Gets a <see cref="Navigation.Crumb"/> collection representing the crumb trail, ordered
		/// oldest <see cref="Navigation.Crumb"/> first
		/// </summary>
		public static ReadOnlyCollection<Crumb> Crumbs
		{
			get
			{
				return new ReadOnlyCollection<Crumb>(CrumbTrailManager.GetCrumbTrailHrefArray());
			}
		}

		internal static void ParseData(NameValueCollection data, bool postBack)
		{
			try
			{
				StateContext.ReservedData.Clear();
				StateContext.Data.Clear();
				foreach (string key in data)
				{
					if (key == StateContext.STATE
						|| key == StateContext.PREVIOUS_STATE
						|| key == StateContext.CRUMB_TRAIL
						|| key == StateContext.RETURN_DATA)
					{
						StateContext.ReservedData[key] = CrumbTrailManager.Parse(key, data[key]);
					}
					else
					{
						if (!postBack)
							StateContext.Data[key] = CrumbTrailManager.Parse(key, data[key]);
					}
				}
				CrumbTrailManager.BuildCrumbTrail();
			}
			catch (ConfigurationErrorsException)
			{
				throw;
			}
			catch (Exception)
			{
				throw new UrlException(Resources.InvalidUrl);
			}
		}

		/// <summary>
		/// Navigates to a <see cref="Navigation.State"/>. Depending on the <paramref name="action"/>
		/// will either navigate to the 'to' <see cref="Navigation.State"/> of a <see cref="Navigation.Transition"/>
		/// or the 'initial' <see cref="Navigation.State"/> of a <see cref="Navigation.Dialog"/>. It passes
		/// no <see cref="Navigation.NavigationData"/> and a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <param name="action">The key of a child <see cref="Navigation.Transition"/> or the key of 
		/// a <see cref="Navigation.Dialog"/></param>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/>; or
		/// there is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static void Navigate(string action)
		{
			Navigate(action, NavigationMode.Client);
		}

		/// <summary>
		/// Navigates to a <see cref="Navigation.State"/>. Depending on the <paramref name="action"/>
		/// will either navigate to the 'to' <see cref="Navigation.State"/> of a <see cref="Navigation.Transition"/>
		/// or the 'initial' <see cref="Navigation.State"/> of a <see cref="Navigation.Dialog"/>. It passes
		/// no <see cref="Navigation.NavigationData"/>
		/// </summary>
		/// <param name="action">The key of a child <see cref="Navigation.Transition"/> or the key of 
		/// a <see cref="Navigation.Dialog"/></param>
		/// <param name="mode">Redirect, Transfer or Mock</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/>; or
		/// there is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static void Navigate(string action, NavigationMode mode)
		{
			Navigate(action, null, mode);
		}

		/// <summary>
		/// Navigates to a <see cref="Navigation.State"/>. Depending on the <paramref name="action"/>
		/// will either navigate to the 'to' <see cref="Navigation.State"/> of a <see cref="Navigation.Transition"/>
		/// or the 'initial' <see cref="Navigation.State"/> of a <see cref="Navigation.Dialog"/>. It passes
		/// a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <param name="action">The key of a child <see cref="Navigation.Transition"/> or the key of 
		/// a <see cref="Navigation.Dialog"/></param>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// next <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/>; or
		/// there is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static void Navigate(string action, NavigationData toData)
		{
			Navigate(action, toData, StateContext.Data, NavigationMode.Client);
		}

		/// <summary>
		/// Navigates to a <see cref="Navigation.State"/>. Depending on the <paramref name="action"/>
		/// will either navigate to the 'to' <see cref="Navigation.State"/> of a <see cref="Navigation.Transition"/>
		/// or the 'initial' <see cref="Navigation.State"/> of a <see cref="Navigation.Dialog"/>
		/// </summary>
		/// <param name="action">The key of a child <see cref="Navigation.Transition"/> or the key of 
		/// a <see cref="Navigation.Dialog"/></param>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// next <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <param name="mode">Redirect, Transfer or Mock</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/>; or
		/// there is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static void Navigate(string action, NavigationData toData, NavigationMode mode)
		{
			Navigate(action, toData, StateContext.Data, mode);
		}

		private static void Navigate(string action, NavigationData toData, NavigationData returnData, NavigationMode mode)
		{
			NavigateLink(GetNavigationLink(action, toData, returnData), mode);
		}

		/// <summary>
		/// Gets a Url to navigate to a <see cref="Navigation.State"/>. Depending on the <paramref name="action"/>
		/// will either navigate to the 'to' <see cref="Navigation.State"/> of a <see cref="Navigation.Transition"/>
		/// or the 'initial' <see cref="Navigation.State"/> of a <see cref="Navigation.Dialog"/>. It passes
		/// no <see cref="Navigation.NavigationData"/>
		/// </summary>
		/// <param name="action">The key of a child <see cref="Navigation.Transition"/> or the key of 
		/// a <see cref="Navigation.Dialog"/></param>
		/// <returns>Url that will navigate to <see cref="Navigation.State"/> specified in the <paramref name="action"/></returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/>; or
		/// there is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static string GetNavigationLink(string action)
		{
			return GetNavigationLink(action, null);
		}

		/// <summary>
		/// Gets a Url to navigate to a <see cref="Navigation.State"/>. Depending on the <paramref name="action"/>
		/// will either navigate to the 'to' <see cref="Navigation.State"/> of a <see cref="Navigation.Transition"/>
		/// or the 'initial' <see cref="Navigation.State"/> of a <see cref="Navigation.Dialog"/>
		/// </summary>
		/// <param name="action">The key of a child <see cref="Navigation.Transition"/> or the key of 
		/// a <see cref="Navigation.Dialog"/></param>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// next <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <returns>Url that will navigate to <see cref="Navigation.State"/> specified in the <paramref name="action"/></returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/>; or
		/// there is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static string GetNavigationLink(string action, NavigationData toData)
		{
			return GetNavigationLink(action, toData, StateContext.Data);
		}

		private static string GetNavigationLink(string action, NavigationData toData, NavigationData returnData)
		{
			return CrumbTrailManager.GetHref(GetNextState(action), toData, returnData);
		}

		/// <summary>
		/// Determines if the <paramref name="distance"/> specified is within the bounds of the crumb
		/// trail represented by the <see cref="Crumbs"/> collection
		/// </summary>
		/// <param name="distance">Starting at 1, the number of <see cref="Navigation.Crumb"/> steps to go back</param>
		/// <returns>False if less than 1 or greater than the size of the <see cref="Crumbs"/> collection;
		/// true otherwise</returns>
		public static bool CanNavigateBack(int distance)
		{
			bool canNavigate = false;
			ReadOnlyCollection<Crumb> crumbs = Crumbs;
			if (distance <= crumbs.Count && distance > 0)
			{
				canNavigate = true;
			}
			return canNavigate;
		}

		/// <summary>
		/// Navigates back to the <see cref="Navigation.Crumb"/> contained in the crumb trail, represented by
		/// the <see cref="Crumbs"/> collection, as specified by the <paramref name="distance"/>.
		/// In the crumb trail no two crumbs can have the same <see cref="State"/> but all must
		/// have the same <see cref="Navigation.Dialog"/>. It passes a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <exception cref="System.ArgumentException"><see cref="CanNavigateBack"/> returns false for
		/// this <paramref name="distance"/></exception>
		public static void NavigateBack(int distance)
		{
			NavigateBack(distance, NavigationMode.Client);
		}

		/// <summary>
		/// Navigates back to the <see cref="Navigation.Crumb"/> contained in the crumb trail, represented by
		/// the <see cref="Crumbs"/> collection, as specified by the <paramref name="distance"/>.
		/// In the crumb trail no two crumbs can have the same <see cref="State"/> but all must
		/// have the same <see cref="Navigation.Dialog"/>
		/// </summary>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <param name="mode">Redirect, Transfer or Mock</param>
		/// <exception cref="System.ArgumentException"><see cref="CanNavigateBack"/> returns false for
		/// this <paramref name="distance"/></exception>
		public static void NavigateBack(int distance, NavigationMode mode)
		{
			NavigateLink(GetNavigationBackLink(distance), mode);
		}

		/// <summary>
		/// Gets a Url to navigate to a <see cref="Navigation.Crumb"/> contained in the crumb trail, 
		/// represented by the <see cref="Crumbs"/> collection, as specified by the <paramref name="distance"/>.
		/// In the crumb trail no two crumbs can have the same <see cref="State"/> but all must
		/// have the same <see cref="Navigation.Dialog"/>
		/// </summary>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <returns>Url that will navigate to <see cref="Navigation.Crumb"/> specified by the <paramref name="distance"/></returns>
		/// <exception cref="System.ArgumentException"><see cref="CanNavigateBack"/> returns false for
		/// this <paramref name="distance"/></exception>
		public static string GetNavigationBackLink(int distance)
		{
			ReadOnlyCollection<Crumb> crumbs = Crumbs;
			if (distance > crumbs.Count || distance <= 0)
			{
				throw new ArgumentException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidDistance, crumbs.Count), "distance");
			}
			return ((Crumb)crumbs[crumbs.Count - distance]).NavigationLink;
		}

		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing no <see cref="Navigation.NavigationData"/>
		/// data and a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		public static void Refresh()
		{
			Refresh(NavigationMode.Client);
		}

		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// current <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static void Refresh(NavigationData toData)
		{
			Refresh(toData, NavigationMode.Client);
		}

		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing no <see cref="Navigation.NavigationData"/>
		/// data
		/// </summary>
		/// <param name="mode">Redirect, Transfer or Mock</param>
		public static void Refresh(NavigationMode mode)
		{
			Refresh(null, mode);
		}

		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/>
		/// </summary>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// current <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <param name="mode">Redirect, Transfer or Mock</param>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static void Refresh(NavigationData toData, NavigationMode mode)
		{
			NavigateLink(GetRefreshLink(toData), mode);
		}

		/// <summary>
		/// Gets a Url to navigate to the current <see cref="Navigation.State"/> passing 
		/// no <see cref="Navigation.NavigationData"/> data
		/// </summary>
		public static string RefreshLink
		{
			get
			{
				return GetRefreshLink(null);
			}
		}

		/// <summary>
		/// Gets a Url to navigate to the current <see cref="Navigation.State"/>
		/// </summary>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// current <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <returns>Url that will navigate to the current <see cref="Navigation.State"/></returns>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		public static string GetRefreshLink(NavigationData toData)
		{
			return CrumbTrailManager.GetRefreshHref(toData);
		}

		private static void NavigateLink(string url, NavigationMode mode)
		{
			if (HttpContext.Current == null) mode = NavigationMode.Mock;
			switch (mode)
			{
				case (NavigationMode.Client):
					{
						HttpContext.Current.Response.Redirect(url, true);
						break;
					}
				case (NavigationMode.Server):
					{
						HttpContext.Current.Server.Transfer(url);
						break;
					}
				case (NavigationMode.Mock):
					{
						ParseData(StateContext.ShieldDecode(HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal))), false), false);
						break;
					}
			}
		}

		/// <summary>
		/// Wraps the ASP.NET <see cref="System.Web.UI.ScriptManager"/> history point functionality.
		/// Adds a history point passing the <see cref="Navigation.StateContext"/> data 
		/// </summary>
		/// <param name="page">Current <see cref="System.Web.UI.Page"/></param>
		/// <param name="title">Title for history point</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="page"/> is null</exception>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		[SuppressMessage("Microsoft.Portability", "CA1903:UseOnlyApiFromTargetedFramework", MessageId = "System.Web.UI.ScriptManager.#AddHistoryPoint(System.Collections.Specialized.NameValueCollection,System.String)")]
		public static void AddHistoryPoint(Page page, string title)
		{
			if (page == null)
				throw new ArgumentNullException("page");
			NameValueCollection coll = new NameValueCollection();
			coll[StateContext.STATE] = StateContext.StateKey;
			foreach (NavigationDataItem item in StateContext.Data)
			{
				coll[item.Key] = CrumbTrailManager.FormatURLObject(item.Value);
			}
			coll = StateContext.ShieldEncode(coll, true);
			ScriptManager.GetCurrent(page).AddHistoryPoint(coll, title);
		}

		/// <summary>
		/// Responds to a <see cref="System.Web.UI.ScriptManager"/> history navigation handler
		/// and restores the <paramref name="data"/> saved by <see cref="AddHistoryPoint"/> method to 
		/// the <see cref="Navigation.StateContext"/>
		/// </summary>
		/// <param name="data">Saved <see cref="Navigation.StateContext"/> to restore</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="data"/> is null</exception>
		/// <exception cref="Navigation.UrlException">There is data that cannot be converted from a <see cref="System.String"/>;
		/// or the <see cref="Navigation.NavigationShield"/> detects tampering</exception>
		public static void RestoreHistoryPoint(NameValueCollection data)
		{
			if (data == null)
				throw new ArgumentNullException("data");
			if (data.Count == 0)
			{
				ParseData(HttpContext.Current.Request.QueryString, false);
			}
			else
			{
				data = StateContext.ShieldDecode(data, true);
				data.Remove(StateContext.STATE);
				data.Remove(StateContext.PREVIOUS_STATE);
				data.Remove(StateContext.CRUMB_TRAIL);
				data.Remove(StateContext.RETURN_DATA);
				foreach (string key in data)
				{
					StateContext.Data[key] = CrumbTrailManager.ParseURLString(data[key]);
				}
			}
		}

		internal static string GetNextState(string action)
		{
			if (action == null)
				throw new ArgumentNullException("action");
			State nextState = null;
			if (StateContext.State != null && StateContext.State.Transitions[action] != null)
			{
				nextState = StateContext.State.Transitions[action].To;
			}
			if (nextState == null && StateInfoConfig.Dialogs[action] != null)
			{
				nextState = StateInfoConfig.Dialogs[action].Initial;
			}
			if (nextState == null)
			{
				throw new ArgumentException(Resources.InvalidAction, "action");
			}
			return StateInfoConfig.GetDialogStateKey(nextState);
		}
	}
}
