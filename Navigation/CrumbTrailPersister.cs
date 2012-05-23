using System.Configuration;

namespace Navigation
{
	/// <summary>
	/// Provides the base functionality for crumb trail persistence mechanisms
	/// </summary>
	public abstract class CrumbTrailPersister : ConfigurationSection
	{
		/// <summary>
		/// Overridden by derived classes to return the persisted crumb trail
		/// </summary>
		/// <param name="crumbTrail"> The key, returned from the <see cref="Save"/> method, to identify 
		/// the persisted crumb trail</param>
		/// <returns>The crumb trail holding navigation and data information</returns>
		public abstract string Load(string crumbTrail);

		/// <summary>
		/// Overridden by derived classes to persist the crumb trail
		/// </summary>
		/// <param name="crumbTrail">The crumb trail holding navigation and data information</param>
		/// <returns>The key to be passed to <see cref="Load"/> method for crumb trail retrieval</returns>
		public abstract string Save(string crumbTrail);
	}
}
