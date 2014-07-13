using Navigation.Sample.Models;
using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
	public class PersonController : Controller
	{
		public ActionResult List(PersonSearchModel model)
		{
			if (StateContext.Bag.name != model.Name)
			{
				StateContext.Bag.startRowIndex = null;
				StateContext.Bag.sortExpression = null;
			}
			StateContext.Bag.name = model.Name;
			model.People = new PersonSearch().Search(StateContext.Bag.name, StateContext.Bag.sortExpression, 
				StateContext.Bag.startRowIndex, StateContext.Bag.maximumRows);
			return View("Listing", model);
		}

		public ActionResult GetDetails(int id)
		{
			return View("Details", new PersonSearch().GetDetails(id));
		}
	}
}