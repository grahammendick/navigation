using System.Linq;
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
				People = people.Select(p => new {
						p.Name,
						p.DateOfBirth,
						link = StateController.GetNavigationLink("Select", new NavigationData { { "id", p.Id } })
					}
				),
				TotalRowCount = StateContext.Bag.totalRowCount
			};
		}

		public Person GetDetails([ModelBinder] int id)
		{
			return new PersonSearch().GetDetails(id);
		}
    }
}
