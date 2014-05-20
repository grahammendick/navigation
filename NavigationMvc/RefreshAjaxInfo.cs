using System.Collections.Generic;
using System.IO;
using System.Web;

namespace Navigation.Mvc
{
	internal sealed class RefreshAjaxInfo
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

		internal NavigationData Data
		{
			get;
			set;
		}

		internal TextWriter Writer
		{
			get;
			set;
		}

		internal static RefreshAjaxInfo GetInfo(HttpContextBase context)
		{
			if (context.Items[typeof(RefreshAjaxInfo)] == null)
				context.Items[typeof(RefreshAjaxInfo)] = new RefreshAjaxInfo();
			return (RefreshAjaxInfo) context.Items[typeof(RefreshAjaxInfo)];
		}
	}
}
