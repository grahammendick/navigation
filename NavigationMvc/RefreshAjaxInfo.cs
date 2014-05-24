using System.Collections.Generic;
using System.IO;
using System.Web;

namespace Navigation.Mvc
{
	internal sealed class RefreshAjaxInfo
	{
		private Dictionary<string, string> _Panels = new Dictionary<string, string>();
		private static readonly object _RefreshAjaxInfoKey = new object();

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
			if (context.Items[_RefreshAjaxInfoKey] == null)
				context.Items[_RefreshAjaxInfoKey] = new RefreshAjaxInfo();
			return (RefreshAjaxInfo)context.Items[_RefreshAjaxInfoKey];
		}
	}
}
