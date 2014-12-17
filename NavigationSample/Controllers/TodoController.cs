using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
    public class TodoController : Controller
    {
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult _Content()
		{
			return View();
		}
	}
}