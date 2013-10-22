using System.Collections.ObjectModel;
#if NET45Plus
using System.Web.WebPages;
#endif

namespace Navigation
{
	internal class StateDisplayInfo
	{
		internal string DisplayModes
		{
			get;
			set;
		}

#if NET45Plus
		internal IDisplayMode DisplayMode
		{
			get;
			set;
		}
#endif

		internal string Page
		{
			get;
			set;
		}

		internal string Route
		{
			get;
			set;
		}

		internal string RouteName
		{
			get;
			set;
		}

		internal string Theme
		{
			get;
			set;
		}

		internal ReadOnlyCollection<string> Masters
		{
			get;
			set;
		}

		internal bool IsPostBack
		{
			get;
			set;
		}
	}
}
