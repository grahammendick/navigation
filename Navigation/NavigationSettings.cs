using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
		/// Gets or sets whether to revert to using ! and _ as separators in the Url. The defaults now 
		/// are _ and - because they are the only non alphanumeric characters that are not Url Encoded 
		/// by either AntiXssEncoder, the default encoder as of VS 2012, and its predecessor
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
	}
}
