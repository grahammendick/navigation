using System;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	/// <summary>
	/// Represents a factory for creating <see cref="NavigationData"/> value provider objects
	/// </summary>
	public sealed class NavigationDataValueProviderFactory : ValueProviderFactory
	{
		/// <summary>
		/// Returns a <see cref="NavigationData"/> value provider for the specified controller context
		/// </summary>
		/// <param name="controllerContext">The context within which the result is executed</param>
		/// <returns><see cref="NavigationData"/> value provider</returns>
		public override IValueProvider GetValueProvider(ControllerContext controllerContext)
		{
			if (controllerContext == null)
				throw new ArgumentNullException("controllerContext");
			return new NavigationDataValueProvider();
		}
	}
}
