using System;
using System.Web.Mvc;

namespace Navigation.Mvc
{
	public sealed class NavigationDataValueProviderFactory : ValueProviderFactory
	{
		public override IValueProvider GetValueProvider(ControllerContext controllerContext)
		{
			if (controllerContext == null)
				throw new ArgumentNullException("controllerContext");
			return new NavigationDataValueProvider();
		}
	}
}
