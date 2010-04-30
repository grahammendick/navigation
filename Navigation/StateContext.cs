using System;
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
		internal static string STATE = "c0";
		internal static string PREVIOUS_STATE = "c1";
		internal static string RETURN_DATA = "c2";
		internal static string CRUMB_TRAIL = "c3";

		/// <summary>
		/// Gets the <see cref="Navigation.State"/> navigated away from to reach the 
		/// current <see cref="Navigation.State"/>
		/// </summary>
		public static State PreviousState
		{
			get
			{
				return GetState(PreviousStateKey);
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

		private static bool StateKeyValid
		{
			get
			{
				try
				{
					int divIndex = StateKey.IndexOf("-", StringComparison.Ordinal);
					if (divIndex <= 0) return false;
					Dialog dialog = StateInfoConfig.Dialogs[int.Parse(StateKey.Substring(0, divIndex), NumberFormatInfo.InvariantInfo)];
					if (dialog != null && dialog.States.Count > int.Parse(StateKey.Substring(divIndex + 1), NumberFormatInfo.InvariantInfo))
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
		}

		/// <summary>
		/// Gets the current <see cref="Navigation.State"/>
		/// </summary>
		public static State State
		{
			get
			{
				if (StateKey == null || !StateKeyValid) return null;
				return GetState(StateKey);
			}
		}

		/// <summary>
		/// Gets the parent of the <see cref="State"/> property
		/// </summary>
		public static Dialog Dialog
		{
			get
			{
				if (StateKey == null || !StateKeyValid) return null;
				return State.Parent;
			}
		}

		[ThreadStatic]
		private static NavigationData _Data;
		/// <summary>
		/// Gets the <see cref="Navigation.NavigationData"/> for the current <see cref="State"/>.
		/// It can be accessed directly or take part in data binding using the <see cref="Navigation.NavigationDataSource"/>
		/// and <see cref="Navigation.NavigationDataParameter"/>. Will become the data stored in 
		/// a <see cref="Navigation.Crumb"/> when part of a crumb trail
		/// </summary>
		public static NavigationData Data
		{
			get
			{
				if (HttpContext.Current != null)
				{
					if (HttpContext.Current.Items["ND"] == null)
						HttpContext.Current.Items["ND"] = new NavigationData();
					return (NavigationData)HttpContext.Current.Items["ND"];
				}
				else
				{
					if (_Data == null)
						_Data = new NavigationData();
				}
				return _Data;
			}
		}

		internal static string StateKey
		{
			get
			{
				return (string) Data[STATE];
			}
			set
			{
				Data[STATE] = value;
			}
		}

		internal static string PreviousStateKey
		{
			get
			{
				return (string)Data[PREVIOUS_STATE];
			}
		}

		internal static string CrumbTrailKey
		{
			get
			{
				return (string)Data[CRUMB_TRAIL];
			}
			set
			{
				Data[CRUMB_TRAIL] = value;
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

		internal static NameValueCollection ShieldEncode(NameValueCollection coll, bool historyPoint)
		{
			NavigationShield shield = (NavigationShield)ConfigurationManager.GetSection("Navigation/NavigationShield");
			if (shield != null)
				return shield.Encode(coll, historyPoint);
			return coll;
		}

		internal static NameValueCollection ShieldDecode(NameValueCollection coll, bool historyPoint)
		{
			NavigationShield shield = (NavigationShield)ConfigurationManager.GetSection("Navigation/NavigationShield");
			if (shield != null)
				return shield.Decode(coll, historyPoint);
			return coll;
		}

		internal static NavigationData ReturnData
		{
			get
			{
				return (NavigationData)Data[RETURN_DATA];
			}
		}

		internal static void Clear()
		{
			Data[RETURN_DATA] = null;
		}

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
