using System.Collections.Generic;
using System.Web;

namespace Navigation.Mvc
{
	internal sealed class AjaxNavigationInfo
	{
		private Dictionary<string, string> _Panels = new Dictionary<string, string>();

		internal Dictionary<string, string> Panels
		{
			get
			{
				return _Panels;
			}
		}

		internal string PanelId
		{
			get;
			set;
		}

		internal static AjaxNavigationInfo GetInfo(HttpContextBase context)
		{
			if (context.Items[typeof(AjaxNavigationInfo)] == null)
				context.Items[typeof(AjaxNavigationInfo)] = new AjaxNavigationInfo();
			return (AjaxNavigationInfo) context.Items[typeof(AjaxNavigationInfo)];
		}
	}
}
