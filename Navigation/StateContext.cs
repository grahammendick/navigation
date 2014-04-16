using System;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
using System.Globalization;
using System.Web;

namespace Navigation
{
	/// <summary>
	/// Provides static properties for accessing context sensitive navigation information.
	/// Holds the current <see cref="Navigation.State"/> and <see cref="Navigation.NavigationData"/>.
	/// Also holds the previous <see cref="Navigation.State"/> (this is not the same as the
	/// previous <see cref="Navigation.Crumb"/>)
	/// </summary>
	public static class StateContext
	{
		private static readonly object _NavigationDataKey = new object();
		private static readonly object _ReservedDataKey = new object();
		internal const string STATE = "c0";
		internal const string PREVIOUS_STATE = "c1";
		internal const string RETURN_DATA = "c2";
		internal const string CRUMB_TRAIL = "c3";
		internal const string DISPLAY_MODES = "n0";
		internal const string HISTORY_URL = "n1";
		internal const string REFRESH_POST_BACK = "n2";

		/// <summary>
		/// Gets the <see cref="Navigation.State"/> navigated away from to reach the 
		/// current <see cref="Navigation.State"/>
		/// </summary>
		public static State PreviousState
		{
			get
			{
				if (PreviousStateId == null || !IsStateKeyValid(PreviousStateId)) return null;
				return GetState(PreviousStateId);
			}
		}

		/// <summary>
		/// Gets the parent of the <see cref="PreviousState"/> property
		/// </summary>
		public static Dialog PreviousDialog
		{
			get
			{
				return PreviousState != null ? PreviousState.Parent : null;
			}
		}

		private static bool IsStateKeyValid(string stateKey)
		{
			try
			{
				int divIndex = stateKey.IndexOf("-", StringComparison.Ordinal);
				if (divIndex <= 0) return false;
				Dialog dialog = StateInfoConfig.Dialogs[int.Parse(stateKey.Substring(0, divIndex), NumberFormatInfo.InvariantInfo)];
				if (dialog != null && dialog.States.Count > int.Parse(stateKey.Substring(divIndex + 1), NumberFormatInfo.InvariantInfo))
				{
					return true;
				}
			}
			catch (FormatException)
			{
				return false;
			}
			catch (OverflowException)
			{
				return false;
			}
			catch (ArgumentOutOfRangeException)
			{
				return false;
			}
			return false;
		}

		/// <summary>
		/// Gets the current <see cref="Navigation.State"/>
		/// </summary>
		public static State State
		{
			get
			{
				if (StateId == null || !IsStateKeyValid(StateId)) return null;
				return GetState(StateId);
			}
		}

		/// <summary>
		/// Gets the parent of the <see cref="State"/> property
		/// </summary>
		public static Dialog Dialog
		{
			get
			{
				return State != null ? State.Parent : null;
			}
		}

		[ThreadStatic]
		private static NavigationData _Data;
		/// <summary>
		/// Gets the <see cref="Navigation.NavigationData"/> for the current <see cref="State"/>.
		/// It can be accessed directly or take part in data binding. Will become the data stored in 
		/// a <see cref="Navigation.Crumb"/> when part of a crumb trail
		/// </summary>
		public static NavigationData Data
		{
			get
			{
				if (HttpContext.Current != null)
				{
					if (HttpContext.Current.Items[_NavigationDataKey] == null)
						HttpContext.Current.Items[_NavigationDataKey] = new NavigationData();
					return (NavigationData)HttpContext.Current.Items[_NavigationDataKey];
				}
				else
				{
					if (_Data == null)
						_Data = new NavigationData();
				}
				return _Data;
			}
		}

#if NET40Plus
		/// <summary>
		/// Gets the dynamic <see cref="Navigation.NavigationData.Bag"/> for the <see cref="Data"/>
		/// </summary>
		public static dynamic Bag
		{
			get
			{
				return Data.Bag;
			}
		}
#endif

		[ThreadStatic]
		private static Hashtable _ReservedData;
		internal static Hashtable ReservedData
		{
			get
			{
				if (HttpContext.Current != null)
				{
					if (HttpContext.Current.Items[_ReservedDataKey] == null)
						HttpContext.Current.Items[_ReservedDataKey] = new Hashtable();
					return (Hashtable)HttpContext.Current.Items[_ReservedDataKey];
				}
				else
				{
					if (_ReservedData == null)
						_ReservedData = new Hashtable();
				}
				return _ReservedData;
			}
		}

		public static string StateId
		{
			get
			{
				return (string)ReservedData[STATE];
			}
			set
			{
				ReservedData[STATE] = value;
			}
		}

		internal static string PreviousStateId
		{
			get
			{
				return (string)ReservedData[PREVIOUS_STATE];
			}
		}

		internal static string CrumbTrailKey
		{
			get
			{
				return (string)ReservedData[CRUMB_TRAIL];
			}
			set
			{
				ReservedData[CRUMB_TRAIL] = value;
			}
		}

		internal static string CrumbTrail
		{
			get
			{
				if (CrumbTrailKey != null)
				{
					CrumbTrailPersister persister = (CrumbTrailPersister)ConfigurationManager.GetSection("Navigation/CrumbTrailPersister");
					if (persister != null)
						return persister.Load(CrumbTrailKey);
				}
				return CrumbTrailKey;
			}
		}

		internal static NavigationData ReturnData
		{
			get
			{
				return (NavigationData)ReservedData[RETURN_DATA];
			}
		}

		internal static void GenerateKey(string trail)
		{
			CrumbTrailKey = trail;
			if (trail != null)
			{
				CrumbTrailPersister persister = (CrumbTrailPersister)ConfigurationManager.GetSection("Navigation/CrumbTrailPersister");
				if (persister != null)
					CrumbTrailKey = persister.Save(trail);
			}
		}

#if NET35Plus
		internal static NameValueCollection ShieldEncode(NameValueCollection coll, bool historyPoint, State state)
		{
			NavigationShield shield = (NavigationShield)ConfigurationManager.GetSection("Navigation/NavigationShield");
			if (shield != null)
				return shield.Encode(coll, historyPoint, state);
			return coll;
		}
#else
		internal static NameValueCollection ShieldEncode(NameValueCollection coll, State state)
		{
			NavigationShield shield = (NavigationShield)ConfigurationManager.GetSection("Navigation/NavigationShield");
			if (shield != null)
				return shield.Encode(coll, state);
			return coll;
		}
#endif

#if NET35Plus
		internal static NameValueCollection ShieldDecode(NameValueCollection coll, bool historyPoint, State state)
		{
			NavigationShield shield = (NavigationShield)ConfigurationManager.GetSection("Navigation/NavigationShield");
			if (shield != null)
				return shield.Decode(coll, historyPoint, state);
			return coll;
		}
#else
		internal static NameValueCollection ShieldDecode(NameValueCollection coll, State state)
		{
			NavigationShield shield = (NavigationShield)ConfigurationManager.GetSection("Navigation/NavigationShield");
			if (shield != null)
				return shield.Decode(coll, state);
			return coll;
		}
#endif

		internal static Dialog GetDialog(string stateKey)
		{
			if (stateKey == null) return null;
			int dialogIndex = int.Parse(stateKey.Substring(0, stateKey.IndexOf("-", StringComparison.Ordinal)), NumberFormatInfo.InvariantInfo);
			return StateInfoConfig.Dialogs[dialogIndex];
		}

		internal static State GetState(string stateKey)
		{
			if (stateKey == null) return null;
			int divIndex = stateKey.IndexOf("-", StringComparison.Ordinal);
			Dialog dialog;
			if (divIndex < 0)
			{
				dialog = Dialog;
			}
			else
			{
				dialog = GetDialog(stateKey);
			}
			int stateIndex = int.Parse(stateKey.Substring(divIndex + 1), NumberFormatInfo.InvariantInfo);
			return dialog.States[stateIndex];
		}
	}
}
