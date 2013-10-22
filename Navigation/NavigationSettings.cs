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

		internal Type StateRouteHandlerType
		{
			get
			{
				return StateRouteHandler.Length == 0 ? typeof(StateRouteHandler) : Type.GetType(StateRouteHandler);
			}
		}
#endif
	}
}
