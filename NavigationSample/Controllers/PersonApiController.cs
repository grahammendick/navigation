using System.Collections.Generic;
using System.Web.Http;

namespace Navigation.Sample.Controllers
{
    public class PersonApiController : ApiController
    {
		public IEnumerable<Person> GetList()
		{
			return new PersonSearch().Search(null, null, null, 0, 10);
		}

		public Person GetDetails(int id)
		{
			return new Person();
		}
    }
}
