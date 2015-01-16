using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Navigation
{
	internal static class CrumbTrailManager
	{
		private static string SEPARATOR = !NavigationSettings.Config.OriginalUrlSeparators ? "_" : "!";
		private static string RET_1_SEP = "1" + SEPARATOR;
		private static string RET_2_SEP = "2" + SEPARATOR;
		private static string RET_3_SEP = "3" + SEPARATOR;
		private static string CRUMB_1_SEP = "4" + SEPARATOR;
		private static string CRUMB_2_SEP = "5" + SEPARATOR;

		internal static List<Crumb> Crumbs
		{
			get
			{
				List<Crumb> crumbTrailArray = new List<Crumb>();
				int arrayCount = 0;
				string trail = StateContext.CrumbTrail;
				int crumbTrailSize = trail == null ? 0 : Regex.Split(trail, CRUMB_1_SEP).Length - 1;
				NavigationData navigationData;
				bool last = true;
				string stateKey = null;
				State state = null;
				while (arrayCount < crumbTrailSize)
				{
					stateKey = Regex.Split(trail.Substring(CRUMB_1_SEP.Length), CRUMB_2_SEP)[0];
					state = StateContext.GetState(stateKey);
					navigationData = GetCrumbTrailData(trail, state);
					trail = CropCrumbTrail(trail);
					crumbTrailArray.Add(new Crumb(navigationData, state, last));
					last = false;
					arrayCount++;
				}
				crumbTrailArray.Reverse();
				return crumbTrailArray;
			}
		}

		private static NavigationData GetCrumbTrailData(string trail, State state)
		{
			NavigationData navData = null;
			string data = Regex.Split(trail.Substring(trail.IndexOf(CRUMB_2_SEP, StringComparison.Ordinal) + CRUMB_2_SEP.Length), CRUMB_1_SEP)[0];
			if (data.Length != 0)
				navData = ParseReturnData(data, state);
			return navData;
		}

		private static string CropCrumbTrail(string trail)
		{
			string croppedTrail;
			int nextTrailStart = trail.IndexOf(CRUMB_1_SEP, 1, StringComparison.Ordinal);
			if (nextTrailStart != -1)
				croppedTrail = trail.Substring(nextTrailStart);
			else
				croppedTrail = "";
			return croppedTrail;
		}

		internal static void BuildCrumbTrail()
		{
			var crumbs = Crumbs;
			if (StateContext.PreviousState != null)
				crumbs.Add(new Crumb(StateContext.ReturnData, StateContext.PreviousState, false));
			crumbs = StateContext.State.StateHandler.TruncateCrumbTrail(StateContext.State, crumbs);
			crumbs.Reverse();
			var trailBuilder = new StringBuilder();
			foreach (var crumb in crumbs)
			{
				trailBuilder.Append(CRUMB_1_SEP);
				trailBuilder.Append(crumb.State.StateKey);
				trailBuilder.Append(CRUMB_2_SEP);
				FormatReturnData(trailBuilder, crumb.State, crumb.Data);
			}
			StateContext.GenerateKey(trailBuilder.Length != 0 ? trailBuilder.ToString() : null);
		}

		internal static string GetHref(string nextState, NavigationData navigationData, NavigationData returnData)
		{
			string previousState = StateContext.StateId;
			string crumbTrail = StateContext.CrumbTrailKey;
			State state = StateContext.GetState(nextState);
			NameValueCollection coll = new NameValueCollection();
			coll[NavigationSettings.Config.StateIdKey] = nextState;
			if (previousState != null && state.TrackCrumbTrail)
			{
				coll[NavigationSettings.Config.PreviousStateIdKey] = previousState;
			}
			if (navigationData != null)
			{
				foreach (NavigationDataItem item in navigationData)
				{
					if (!item.Value.Equals(string.Empty) && !state.DefaultOrDerived(item.Key, item.Value))
						coll[item.Key] = FormatURLObject(item.Key, item.Value, state);
				}
			}
			if (returnData != null && state.TrackCrumbTrail && StateContext.State != null)
			{
				var returnDataBuilder = FormatReturnData(null, StateContext.State, returnData);
				if (returnDataBuilder.Length > 0)
					coll[NavigationSettings.Config.ReturnDataKey] = returnDataBuilder.ToString();
			}
			if (crumbTrail != null && state.TrackCrumbTrail)
			{
				coll[NavigationSettings.Config.CrumbTrailKey] = crumbTrail;
			}
#if NET35Plus
			coll = StateContext.ShieldEncode(coll, false, state);
#else
			coll = StateContext.ShieldEncode(coll, state);
#endif
#if NET40Plus
			HttpContextBase context = null;
			if (HttpContext.Current != null)
				context = new HttpContextWrapper(HttpContext.Current);
			else
				context = new MockNavigationContext(null, state);
			return state.StateHandler.GetNavigationLink(state, coll, context);
#else
			return state.StateHandler.GetNavigationLink(state, coll);
#endif
		}

		private static StringBuilder FormatReturnData(StringBuilder returnDataBuilder, State state, NavigationData returnData)
		{
			returnDataBuilder = returnDataBuilder ?? new StringBuilder();
			string prefix = string.Empty;
			foreach (NavigationDataItem item in returnData)
			{
				if (!item.Value.Equals(string.Empty) && !state.DefaultOrDerived(item.Key, item.Value))
				{
					returnDataBuilder.Append(prefix);
					returnDataBuilder.Append(EncodeURLValue(item.Key));
					returnDataBuilder.Append(RET_1_SEP);
					returnDataBuilder.Append(FormatURLObject(item.Key, item.Value, state));
					prefix = RET_3_SEP;
				}
			}
			return returnDataBuilder;
		}

		private static string DecodeURLValue(string urlValue)
		{
			return urlValue.Replace("0" + SEPARATOR, SEPARATOR);
		}

		private static string EncodeURLValue(string urlValue)
		{
			return urlValue.Replace(SEPARATOR, "0" + SEPARATOR);
		}

		internal static string FormatURLObject(string key, object urlObject, State state)
		{
			Type defaultType = state.DefaultTypes[key] ?? typeof(string);
			string converterKey = ConverterFactory.GetKey(urlObject);
			string formattedValue = ConverterFactory.GetConverter(converterKey).ConvertToInvariantString(urlObject);
			formattedValue = EncodeURLValue(formattedValue);
			if (urlObject.GetType() != defaultType)
				formattedValue += RET_2_SEP + converterKey;
			return formattedValue;
		}

		internal static object ParseURLString(string key, string val, State state)
		{
			Type defaultType = state.DefaultTypes[key] ?? typeof(string);
			string urlValue = val;
			string converterKey = ConverterFactory.GetKey(defaultType);
			if (val.IndexOf(RET_2_SEP, StringComparison.Ordinal) > -1)
			{
				string[] arr = Regex.Split(val, RET_2_SEP);
				urlValue = arr[0];
				converterKey = arr[1];
			}
			try
			{
				return ConverterFactory.GetConverter(converterKey).ConvertFromInvariantString(DecodeURLValue(urlValue));
			}
			catch (Exception ex)
			{
				throw new UrlException(Resources.InvalidUrl, ex);
			}
		}

		internal static string GetRefreshHref(NavigationData refreshData)
		{
			return GetHref(StateContext.StateId, refreshData, null);
		}

		internal static object Parse(string key, string val, State state)
		{
			object parsedVal;
			if (key == NavigationSettings.Config.ReturnDataKey)
			{
				parsedVal = ParseReturnData(val, state);
			}
			else
			{
				if (key == NavigationSettings.Config.CrumbTrailKey)
				{
					parsedVal = val;
				}
				else
				{
					parsedVal = ParseURLString(key, val, state);
				}
			}
			return parsedVal;
		}

		private static NavigationData ParseReturnData(string returnData, State state)
		{
			NavigationData navData = new NavigationData();
			string[] nameValuePair;
			string[] returnDataArray = Regex.Split(returnData, RET_3_SEP);
			for (int i = 0; i < returnDataArray.Length; i++)
			{
				nameValuePair = Regex.Split(returnDataArray[i], RET_1_SEP);
				navData.Add(DecodeURLValue(nameValuePair[0]), ParseURLString(DecodeURLValue(nameValuePair[0]), nameValuePair[1], state));
			}
			return navData;
		}
	}
}
