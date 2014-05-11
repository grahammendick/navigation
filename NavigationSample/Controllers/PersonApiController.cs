using Navigation.Sample.Models;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Navigation.Sample.Controllers
{
    public class PersonApiController : ApiController
    {
		public PersonApiSearchModel GetList(
			[ModelBinder] string name,
			[ModelBinder] string sortExpression,
			[ModelBinder] int startRowIndex,
			[ModelBinder] int maximumRows)
		{
			var people = new PersonSearch().Search(name, sortExpression, startRowIndex, maximumRows);
			return new PersonApiSearchModel{
				People = people.Select(p => new PersonApiModel{
					Id = p.Id,
					Name = p.Name,
					DateOfBirth = p.DateOfBirth,
					DetailsLink = StateController.GetNavigationLink("Select", new NavigationData { { "id", p.Id } })
				}),
				Total = StateContext.Bag.totalRowCount,
				NextLink = StateController.GetRefreshLink(new NavigationData { { "startRowIndex", startRowIndex + maximumRows } })
			};
		}

		public Person GetDetails([ModelBinder] int id)
		{
			return new PersonSearch().GetDetails(id);
		}
    }
}
