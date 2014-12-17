using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
    public class TodoController : Controller
    {
        //
        // GET: /Todo/
        public ActionResult Index()
        {
            return View();
        }
	}
}