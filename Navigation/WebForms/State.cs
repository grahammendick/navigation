using System.Collections.ObjectModel;
using System.Text.RegularExpressions;

namespace Navigation
{
	public partial class State
	{
		private string _Page;
		private string _MobilePage;
#if NET40Plus
		private string _MobileRoute;
		private bool? _CheckPhysicalUrlAccess;
#endif
		private string _Theme;
		private string _MobileTheme;
		private ReadOnlyCollection<string> _Masters;
		private ReadOnlyCollection<string> _MobileMasters;

		/// <summary>
		/// Gets the aspx page to display when navigating to this <see cref="Navigation.State"/>
		/// </summary>
		public string Page
		{
			get
			{
				if (_Page == null)
					_Page = Attributes["page"] != null ? Attributes["page"].Trim() : string.Empty;
				return _Page;
			}
		}

		/// <summary>
		/// Gets the aspx page to display for a mobile device navigating to this <see cref="Navigation.State"/>
		/// </summary>
		public string MobilePage
		{
			get
			{
				if (_MobilePage == null)
					_MobilePage = Attributes["mobilePage"] != null ? Attributes["mobilePage"].Trim() : string.Empty;
				return _MobilePage;
			}
		}

#if NET40Plus
		/// <summary>
		/// Gets the mobile device route Url pattern
		/// </summary>
		public string MobileRoute
		{
			get
			{
				if (_MobileRoute == null)
					_MobileRoute = Attributes["mobileRoute"] != null ? Attributes["mobileRoute"] : string.Empty;
				return _MobileRoute;
			}
		}

		/// <summary>
		/// Gets a value that indicates whether ASP.NET should validate that the user has authority to access the 
		/// physical <see cref="Page"/>. This is only relevant if <see cref="Route"/> or <see cref="MobileRoute"/>
		/// is set
		/// </summary>
		public bool CheckPhysicalUrlAccess
		{
			get
			{
				if (!_CheckPhysicalUrlAccess.HasValue)
				{
					_CheckPhysicalUrlAccess = true;
					if (Attributes["checkPhysicalUrlAccess"] != null)
					{
						bool result;
						if (bool.TryParse(Attributes["checkPhysicalUrlAccess"], out result))
							_CheckPhysicalUrlAccess = result;
					}
				}
				return _CheckPhysicalUrlAccess.Value;
			}
		}
#endif

		/// <summary>
		/// Gets the theme to assign to the <see cref="Page"/> when displayed
		/// </summary>
		public string Theme
		{
			get
			{
				if (_Theme == null)
					_Theme = Attributes["theme"] != null ? Attributes["theme"].Trim() : string.Empty;
				return _Theme;
			}
		}

		/// <summary>
		/// Gets the theme to assign to the <see cref="Page"/> when displayed for a mobile device
		/// </summary>
		public string MobileTheme
		{
			get
			{
				if (_MobileTheme == null)
					_MobileTheme = Attributes["mobileTheme"] != null ? Attributes["mobileTheme"].Trim() : string.Empty;
				return _MobileTheme;
			}
		}

		/// <summary>
		/// Gets the master pages to assign to the <see cref="Page"/> when displayed
		/// </summary>
		public ReadOnlyCollection<string> Masters
		{
			get
			{
				if (_Masters == null)
					_Masters = GetMasters("masters");
				return _Masters;
			}
		}

		/// <summary>
		/// Gets the master pages to assign to the <see cref="Page"/> when displayed for a mobile device
		/// </summary>
		public ReadOnlyCollection<string> MobileMasters
		{
			get
			{
				if (_MobileMasters == null)
					_MobileMasters = GetMasters("mobileMasters");
				return _MobileMasters;
			}
		}

		private ReadOnlyCollection<string> GetMasters(string key)
		{
			string[] masters = new string[] { };
			if (Attributes[key] != null)
			{
				masters = Regex.Split(Attributes[key], ",");
				for (int j = 0; j < masters.Length; j++)
					masters[j] = masters[j].Trim();
			}
			return new ReadOnlyCollection<string>(masters);
		}

		internal string GetPage(bool mobile)
		{
			return (!mobile || MobilePage.Length == 0) ? Page : MobilePage;
		}

#if NET40Plus
		internal string GetRoute(bool mobile)
		{
			return (!mobile || (MobilePage.Length == 0 && MobileRoute.Length == 0)) ? Route : MobileRoute;
		}

		internal string GetRouteName(bool mobile)
		{
			return (!mobile || (MobilePage.Length == 0 && MobileRoute.Length == 0)) ? Id : "Mobile" + Id;
		}
#endif

		internal ReadOnlyCollection<string> GetMasters(bool mobile)
		{
			return (!mobile || (MobilePage.Length == 0 && MobileMasters.Count == 0)) ? Masters : MobileMasters;
		}

		internal string GetTheme(bool mobile)
		{
			return (!mobile || (MobilePage.Length == 0 && MobileTheme.Length == 0)) ? Theme : MobileTheme;
		}

		partial void SetStateHandler()
		{
			StateHandler = new PageStateHandler();
		}
	}
}
