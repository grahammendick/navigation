using System.Web.Http.Controllers;
using System.Web.Http.ValueProviders;

namespace Navigation.WebApi
{
	public class NavigationDataValueProviderFactory : ValueProviderFactory
	{
		public override IValueProvider GetValueProvider(HttpActionContext actionContext)
		{
			return new NavigationDataValueProvider();
		}
	}
}
