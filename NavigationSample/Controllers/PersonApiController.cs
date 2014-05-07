using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Navigation.Sample.Controllers
{
    public class PersonApiController : ApiController
    {
		public object GetList(
			[ModelBinder] string name,
			[ModelBinder] string minDateOfBirth,
			[ModelBinder] string sortExpression,
			[ModelBinder] int startRowIndex,
			[ModelBinder] int maximumRows)
		{
			var people = new PersonSearch().Search(name, minDateOfBirth, sortExpression, startRowIndex, maximumRows);
			return new {
				People = people,
				TotalRowCount = StateContext.Bag.totalRowCount
			};
		}

		public Person GetDetails(int id)
		{
			return new Person();
		}
    }
}
