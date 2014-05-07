using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Navigation.Sample.Controllers
{
    public class PersonApiController : ApiController
    {
		public IEnumerable<Person> GetList(
			[ModelBinder] string name,
			[ModelBinder] string minDateOfBirth,
			[ModelBinder] string sortExpression,
			[ModelBinder] int startRowIndex,
			[ModelBinder] int maximumRows)
		{
			return new PersonSearch().Search(name, minDateOfBirth, sortExpression, startRowIndex, maximumRows);
		}

		public Person GetDetails(int id)
		{
			return new Person();
		}
    }
}
