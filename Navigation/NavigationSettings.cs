using System;
using System.Configuration;

namespace Navigation
{
	/// <summary>
	/// Provides access to the Navigation Settings configuration section
	/// </summary>
	public class NavigationSettings : ConfigurationSection
	{
		private static NavigationSettings _Config = (NavigationSettings) ConfigurationManager.GetSection("Navigation/Settings") ?? new NavigationSettings();

		internal static NavigationSettings Config
		{
			get
			{
				return _Config;
			}
		}

		/// <summary>
		/// Gets or sets whether to revert to using ! and _ as separators in the Url
		/// </summary>
		[ConfigurationProperty("originalUrlSeparators", DefaultValue = false)]
		public bool OriginalUrlSeparators
		{
			get
			{
				return (bool)this["originalUrlSeparators"];
			}
			set
			{
				this["originalUrlSeparators"] = value;
			}
		}

#if NET45Plus
		/// <summary>
		/// Gets or sets the custom <see cref="Navigation.StateRouteHandler"/>
		/// </summary>
		[ConfigurationProperty("stateRouteHandler", DefaultValue = "")]
		public string StateRouteHandler
		{
			get
			{
				return (string)this["stateRouteHandler"];
			}
			set
			{
				this["stateRouteHandler"] = value;
			}
		}
#endif

		/// <summary>
		/// Gets or sets the application path to use outside of a web context
		/// </summary>
		[ConfigurationProperty("applicationPath", DefaultValue = "/")]
		public string ApplicationPath
		{
			get
			{
				return (string)this["applicationPath"];
			}
			set
			{
				this["applicationPath"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the Url for the login page that the authentication provider will redirect to
		/// </summary>
		[ConfigurationProperty("loginPath", DefaultValue = "")]
		public string LoginPath
		{
			get
			{
				return (string)this["loginPath"];
			}
			set
			{
				this["loginPath"] = value;
			}
		}

		/// <summary>
		/// Gets or sets the query string key that identifies the Url the authentication provider will
		/// redirect to after a successful login
		/// </summary>
		[ConfigurationProperty("returnUrlKey", DefaultValue = "ReturnUrl")]
		public string ReturnUrlKey
		{
			get
			{
				return (string)this["returnUrlKey"];
			}
			set
			{
				this["returnUrlKey"] = value;
			}
		}
	}
}
