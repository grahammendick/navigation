#if !NET40Plus
using System;
#endif
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace Navigation.Test
{
	public class CustomStateHandler : PageStateHandler
	{
#if NET40Plus
		public override string GetNavigationLink(State state, NameValueCollection data, HttpContextBase context)
		{
			data["previous"] = data[NavigationSettings.Config.PreviousStateIdKey];
			data.Remove(NavigationSettings.Config.PreviousStateIdKey);
			return base.GetNavigationLink(state, data, context) + "&custom=custom";
		}

		public override NameValueCollection GetNavigationData(State state, HttpContextBase context)
		{
			var data = base.GetNavigationData(state, context);
			data[NavigationSettings.Config.PreviousStateIdKey] = data["previous"];
			data.Remove("previous");
			data.Remove("custom");
			return data;
		}
#else
		public void NavigateLink(State state, string url, NavigationMode mode)
		{
			StateController.SetStateContext(state.Id, HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal))));
		}

#endif
		public override List<Crumb> TruncateCrumbTrail(State state, List<Crumb> crumbs)
		{
			var newCrumbs = new List<Crumb>();
			var d6Crumbs = new List<Crumb>();
			if (state.Parent.Key == "d6")
			{
				foreach(var crumb in crumbs)
				{
					if (crumb.State.Parent.Key == "d0" || crumb.State.Parent.Key == "d3")
						newCrumbs.Add(crumb);
					if (crumb.State.Parent.Key == "d6")
						d6Crumbs.Add(crumb);
				}
			}
			newCrumbs.AddRange(base.TruncateCrumbTrail(state, d6Crumbs));
			return newCrumbs;
		}
	}
}
