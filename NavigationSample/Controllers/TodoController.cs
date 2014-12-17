using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
    public class TodoController : Controller
    {
		[ActionSelector]
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult _Content()
		{
			return View();
		}

		[ActionSelector]
		public ActionResult Add()
		{
			return View();
		}
	}
}