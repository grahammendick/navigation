using Navigation.Sample.Models;
using System;
using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
	public class PersonController : Controller
	{
		public ActionResult Index(PersonSearchModel model)
		{
			DateTime outDate;
			if (model.MinDateOfBirth == null || DateTime.TryParse(model.MinDateOfBirth, out outDate))
			{
				if (StateContext.Bag.name != model.Name || StateContext.Bag.minDateOfBirth != model.MinDateOfBirth)
				{
					StateContext.Bag.startRowIndex = null;
					StateContext.Bag.sortExpression = null;
				}
				StateContext.Bag.name = model.Name;
				StateContext.Bag.minDateOfBirth = model.MinDateOfBirth;
			}
			else
			{
				ModelState.AddModelError("MinDateOfBirth", "date error");
			}
			model.People = new PersonSearch().Search(StateContext.Bag.name, StateContext.Bag.minDateOfBirth,
				StateContext.Bag.sortExpression, StateContext.Bag.startRowIndex, StateContext.Bag.maximumRows);
			return View("Listing", model);
		}

		public ActionResult GetDetails(int id)
		{
			return View("Details", new PersonSearch().GetDetails(id));
		}
	}
}