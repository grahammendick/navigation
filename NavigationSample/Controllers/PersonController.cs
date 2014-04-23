using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
    public class PersonController : Controller
    {
        public ActionResult Index()
        {
            return View("Listing", new PersonSearch().Search(null, null, null, 0, 10));
        }

		public ActionResult GetDetails(int id)
		{
			return View("Details", new PersonSearch().GetDetails(id));
		}
	}
}