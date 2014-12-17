using Navigation.Sample.Models;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
    public class TodoController : Controller
    {
		private List<Todo> Todos
		{
			get
			{
				if (Session["todos"] == null)
					Session["todos"] = new List<Todo>();
				return (List<Todo>) Session["todos"];
			}
		}

		[ActionSelector]
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult _Content()
		{
			return View(new TodoModel { Todos = Todos });
		}

		[ActionSelector]
		public ActionResult Add(TodoModel todoModel)
		{
			Todos.Add(new Todo { Title = todoModel.Title });
			return View();
		}
	}
}