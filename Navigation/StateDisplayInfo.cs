using System.Collections.ObjectModel;
using System.Web.WebPages;

namespace Navigation
{
	internal class StateDisplayInfo
	{
		internal string DisplayModes
		{
			get;
			set;
		}

		internal IDisplayMode DisplayMode
		{
			get;
			set;
		}

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
