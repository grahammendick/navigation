using System.Web.Http;

namespace Navigation.Sample.Controllers
{
    public class PersonApiController : ApiController
    {
		public Person GetDetails(int id)
		{
			return new Person();
		}
    }
}
