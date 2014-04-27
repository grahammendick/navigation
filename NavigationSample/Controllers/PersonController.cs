using Navigation.Sample.Models;
using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
	public class PersonController : Controller
	{
		public ActionResult Index(
			PersonSearchModel model,
			string sortExpression,
			int startRowIndex,
			int maximumRows)
		{
			model.People = new PersonSearch().Search(model.Name, model.MinDateOfBirth, sortExpression, startRowIndex, maximumRows);
			return View("Listing", model);
		}

		public ActionResult GetDetails(int id)
		{
			return View("Details", new PersonSearch().GetDetails(id));
		}
	}
}