using Navigation.Sample.Models;
using System.Collections.Generic;
using System.Linq;
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

		[ChildParentSync]
		[ChildActionOnly]
		public ActionResult _Content(string mode)
		{
			var model = new TodoModel { Todos = Todos };
			if (mode != "all")
				model.Todos = model.Todos.Where(t => t.Completed == (mode == "completed"));
			return View(model);
		}

		[ActionSelector]
		public ActionResult Add(TodoModel todoModel)
		{
			if (!string.IsNullOrWhiteSpace(todoModel.NewTitle))
			{
				ModelState.Remove("NewTitle");
				StateContext.Bag.id = null;
				Todos.Add(new Todo
				{ 
					Id = (Todos.Max(t => (int?) t.Id) ?? 0) + 1,
					Title = todoModel.NewTitle.Trim() });
			}
			return View();
		}

		[ActionSelector]
		public ActionResult Edit(Todo todo)
		{
			if (!string.IsNullOrWhiteSpace(todo.Title))
			{
				StateContext.Bag.id = null;
				Todos.First(t => t.Id == todo.Id).Title = todo.Title.Trim();
			}
			return View();
		}

		[ActionSelector]
		public ActionResult Complete(Todo todo)
		{
			StateContext.Bag.id = null;
			Todos.First(t => t.Id == todo.Id).Completed = true;
			return View();
		}

		[ActionSelector]
		public ActionResult Activate(Todo todo)
		{
			StateContext.Bag.id = null;
			Todos.First(t => t.Id == todo.Id).Completed = false;
			return View();
		}

		[ActionSelector]
		public ActionResult Delete(Todo todo)
		{
			StateContext.Bag.id = null;
			Todos.Remove(Todos.First(t => t.Id == todo.Id));
			return View();
		}
	}
}