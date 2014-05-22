using System;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Configuration;
using System.Globalization;
using System.Web;

namespace Navigation
{
#if !NET35Plus
	/// <summary>
	/// Manages all navigation. These can be forward using an action parameter; backward via
	/// a <see cref="Navigation.Crumb"/>; or refreshing the current <see cref="Navigation.State"/>.
	/// </summary>
#endif
	public static partial class StateController
	{
		/// <summary>
		/// Gets a <see cref="Navigation.Crumb"/> collection representing the crumb trail, ordered
		/// oldest <see cref="Navigation.Crumb"/> first
		/// </summary>
		public static ReadOnlyCollection<Crumb> Crumbs
		{
			get
			{
				return new ReadOnlyCollection<Crumb>(CrumbTrailManager.CrumbTrailHrefArray);
			}
		}

#if NET40Plus
		/// <summary>
		/// Sets the <see cref="Navigation.StateContext.Data">Context Data</see> with the data returned
		/// from the current <see cref="Navigation.State"/>'s <see cref="Navigation.IStateHandler"/>
		/// </summary>
		/// <param name="stateId">The current state id</param>
		/// <param name="context">The current context</param>
		public static void SetStateContext(string stateId, HttpContextBase context)
#else
		/// <summary>
		/// Sets the <see cref="Navigation.StateContext.Data">Context Data</see> with the data returned
		/// from the current <see cref="Navigation.State"/>'s <see cref="Navigation.IStateHandler"/>
		/// </summary>
		/// <param name="stateId">The current state id</param>
		/// <param name="data">The current context data</param>
		public static void SetStateContext(string stateId, NameValueCollection data)
#endif
		{
			try
			{
				StateContext.StateId = stateId;
				State state = StateContext.State;
#if NET40Plus
				NameValueCollection data = state.StateHandler.GetNavigationData(state, context);
#else
				data = state.StateHandler.GetNavigationData(state, data);
#endif
				RemoveDefaultsAndDerived(data);
#if NET35Plus
				data = StateContext.ShieldDecode(data, false, state);
#else
				data = StateContext.ShieldDecode(data, state);
#endif
				StateContext.ReservedData.Clear();
				StateContext.Data.SetDefaults(null);
				StateContext.Data.Clear();
				StateContext.StateId = state.Id;
				foreach (string key in data)
				{
					if (key == NavigationSettings.Config.StateIdKey
						|| key == NavigationSettings.Config.PreviousStateIdKey
						|| key == NavigationSettings.Config.CrumbTrailKey
						|| key == NavigationSettings.Config.ReturnDataKey)
					{
						StateContext.ReservedData[key] = CrumbTrailManager.Parse(key, data[key],
							key != NavigationSettings.Config.ReturnDataKey ? state : StateContext.GetState(data[NavigationSettings.Config.PreviousStateIdKey]));
					}
					else
					{
						StateContext.Data[key] = CrumbTrailManager.Parse(key, data[key], state);
					}
				}
				StateContext.Data.SetDefaults(state.Defaults);
				CrumbTrailManager.BuildCrumbTrail();
			}
			catch (ConfigurationErrorsException)
			{
				throw;
			}
			catch (Exception ex)
			{
				throw new UrlException(Resources.InvalidUrl, ex);
			}
		}

#if NET40Plus
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
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
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
#endif
		public static void Navigate(string action)
		{
			Navigate(action, NavigationMode.Client);
		}

#if NET40Plus
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
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
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
#endif
		public static void Navigate(string action, NavigationMode mode)
		{
			Navigate(action, null, mode);
		}

#if NET40Plus
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
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
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
#endif
		public static void Navigate(string action, NavigationData toData)
		{
			Navigate(action, toData, StateContext.Data, NavigationMode.Client);
		}

#if NET40Plus
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
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
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
#endif
		public static void Navigate(string action, NavigationData toData, NavigationMode mode)
		{
			Navigate(action, toData, StateContext.Data, mode);
		}

		private static void Navigate(string action, NavigationData toData, NavigationData returnData, NavigationMode mode)
		{
			string url = GetNavigationLink(action, toData, returnData);
#if NET40Plus
			if (url == null)
				throw new InvalidOperationException(Resources.InvalidRouteData);
#endif
			NavigateLink(GetNextState(action), url, mode);
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
			return CrumbTrailManager.GetHref(GetNextState(action).Id, toData, returnData);
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

#if NET40Plus
		/// <summary>
		/// Navigates back to the <see cref="Navigation.Crumb"/> contained in the crumb trail, represented by
		/// the <see cref="Crumbs"/> collection, as specified by the <paramref name="distance"/>.
		/// In the crumb trail no two crumbs can have the same <see cref="State"/> but all must
		/// have the same <see cref="Navigation.Dialog"/>. It passes a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <exception cref="System.ArgumentException"><see cref="CanNavigateBack"/> returns false for
		/// this <paramref name="distance"/></exception>
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
		/// <summary>
		/// Navigates back to the <see cref="Navigation.Crumb"/> contained in the crumb trail, represented by
		/// the <see cref="Crumbs"/> collection, as specified by the <paramref name="distance"/>.
		/// In the crumb trail no two crumbs can have the same <see cref="State"/> but all must
		/// have the same <see cref="Navigation.Dialog"/>. It passes a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <exception cref="System.ArgumentException"><see cref="CanNavigateBack"/> returns false for
		/// this <paramref name="distance"/></exception>
#endif
		public static void NavigateBack(int distance)
		{
			NavigateBack(distance, NavigationMode.Client);
		}

#if NET40Plus
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
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
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
#endif
		public static void NavigateBack(int distance, NavigationMode mode)
		{
			string url = GetNavigationBackLink(distance);
#if NET40Plus
			if (url == null)
				throw new InvalidOperationException(Resources.InvalidRouteData);
#endif
			NavigateLink(GetCrumb(distance).State, url, mode);
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
			return GetCrumb(distance).NavigationLink;
		}

#if NET40Plus
		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing no <see cref="Navigation.NavigationData"/>
		/// data and a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing no <see cref="Navigation.NavigationData"/>
		/// data and a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
#endif
		public static void Refresh()
		{
			Refresh(NavigationMode.Client);
		}

#if NET40Plus
		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// current <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing a <see cref="Navigation.NavigationMode"/> of Client
		/// </summary>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// current <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
#endif
		public static void Refresh(NavigationData toData)
		{
			Refresh(toData, NavigationMode.Client);
		}

#if NET40Plus
		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing no <see cref="Navigation.NavigationData"/>
		/// data
		/// </summary>
		/// <param name="mode">Redirect, Transfer or Mock</param>
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/> passing no <see cref="Navigation.NavigationData"/>
		/// data
		/// </summary>
		/// <param name="mode">Redirect, Transfer or Mock</param>
#endif
		public static void Refresh(NavigationMode mode)
		{
			Refresh(null, mode);
		}

#if NET40Plus
		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/>
		/// </summary>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// current <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <param name="mode">Redirect, Transfer or Mock</param>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
		/// <exception cref="System.InvalidOperationException">A mandatory route parameter has not been supplied a value</exception>
#else
		/// <summary>
		/// Navigates to the current <see cref="Navigation.State"/>
		/// </summary>
		/// <param name="toData">The <see cref="Navigation.NavigationData"/> to be passed to the 
		/// current <see cref="Navigation.State"/> and stored in the <see cref="Navigation.StateContext"/></param>
		/// <param name="mode">Redirect, Transfer or Mock</param>
		/// <exception cref="System.ArgumentException">There is <see cref="Navigation.NavigationData"/> that cannot be converted to a <see cref="System.String"/></exception>
#endif
		public static void Refresh(NavigationData toData, NavigationMode mode)
		{
			string url = GetRefreshLink(toData);
#if NET40Plus
			if (url == null)
				throw new InvalidOperationException(Resources.InvalidRouteData);
#endif
			NavigateLink(StateContext.State, url, mode);
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

		/// <summary>
		/// 
		/// </summary>
		/// <param name="state"></param>
		/// <param name="url"></param>
		/// <param name="mode"></param>
		public static void NavigateLink(State state, string url, NavigationMode mode)
		{
#if NET40Plus
			HttpContextBase context = null;
			if (HttpContext.Current != null && mode != NavigationMode.Mock)
				context = new HttpContextWrapper(HttpContext.Current);
			else
				context = new MockNavigationContext(url, state);
			state.StateHandler.NavigateLink(state, url, mode, context);
#else
			state.StateHandler.NavigateLink(state, url, mode);
#endif
		}

		private static void RemoveDefaultsAndDerived(NameValueCollection data)
		{
			foreach (string key in StateContext.State.FormattedDefaults.Keys)
			{
				if (data[key] == StateContext.State.FormattedDefaults[key])
					data.Remove(key);
			}
			foreach (string key in StateContext.State.Derived)
			{
				data.Remove(key);
			}
		}

		/// <summary>
		/// Gets the next <see cref="Navigation.State"/>. Depending on the <paramref name="action"/>
		/// will either return the 'to' <see cref="Navigation.State"/> of a <see cref="Navigation.Transition"/>
		/// or the 'initial' <see cref="Navigation.State"/> of a <see cref="Navigation.Dialog"/>
		/// </summary>
		/// <param name="action">The key of a child <see cref="Navigation.Transition"/> or the key of 
		/// a <see cref="Navigation.Dialog"/></param>
		/// <returns>The next <see cref="Navigation.State"/></returns>
		/// <exception cref="System.ArgumentNullException"><paramref name="action"/> is null</exception>
		/// <exception cref="System.ArgumentException"><paramref name="action"/> does not match the key of 
		/// a child <see cref="Navigation.Transition"/> or the key of a <see cref="Navigation.Dialog"/></exception>
		public static State GetNextState(string action)
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
			return nextState;
		}

		/// <summary>
		/// Gets the <see cref="Navigation.Crumb"/> contained in the crumb trail, represented by the <see cref="Crumbs"/>
		/// collection, as specified by the <paramref name="distance"/>. In the crumb trail no two crumbs can have the same
		/// <see cref="State"/> but all must have the same <see cref="Navigation.Dialog"/>
		/// </summary>
		/// <param name="distance">Starting at 1, the number of <see cref="Crumb"/> steps to go back</param>
		/// <returns>The <see cref="Navigation.Crumb"/></returns>
		/// <exception cref="System.ArgumentException"><see cref="CanNavigateBack"/> returns false for
		/// this <paramref name="distance"/></exception>
		public static Crumb GetCrumb(int distance)
		{
			ReadOnlyCollection<Crumb> crumbs = Crumbs;
			if (distance > crumbs.Count || distance <= 0)
			{
				throw new ArgumentException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidDistance, crumbs.Count), "distance");
			}
			return crumbs[crumbs.Count - distance];
		}
	}
}
