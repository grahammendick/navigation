using Navigation.Sample.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Navigation.Sample.Controllers
{
    public class TodoController : Controller
    {
		private static int Id = 1;

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

		[ChildActionOnly]
		public ActionResult _Content(string mode)
		{
			var model = new TodoModel { Todos = Todos };
			model.ItemsLeft = model.Todos.Count(t => !t.Completed);
			model.CompletedCount = model.Todos.Count(t => t.Completed);
			if (mode != "all")
				model.Todos = model.Todos.Where(t => t.Completed == (mode == "completed"));
			return View(model);
		}

		[ActionSelector]
		public ActionResult Add(TodoModel todoModel)
		{
			if (!string.IsNullOrWhiteSpace(todoModel.NewTitle))
			{
				StateContext.Bag.id = null;
				var todo = new Todo {
					Id = Id++,
					Title = todoModel.NewTitle.Trim()
				};
				Todos.Add(todo);
				HttpContext.Items["todoId"] = todo.Id;
			}
			return View();
		}

		[ActionSelector]
		public ActionResult Edit(Todo todo, bool cancel = false)
		{
			HttpContext.Items["edit"] = true;
			StateContext.Bag.id = null;
			var title = todo.Title;
			todo = Todos.FirstOrDefault(t => t.Id == todo.Id);
			if (todo != null && !cancel)
			{
				if (!string.IsNullOrWhiteSpace(title))
					todo.Title = title.Trim();
				else
					Todos.Remove(todo);
			}
			return View();
		}

		[ActionSelector]
		public ActionResult Toggle(Todo todo, bool complete)
		{
			HttpContext.Items["todoId"] = StateContext.Bag.id;
			StateContext.Bag.id = null;
			todo = Todos.FirstOrDefault(t => t.Id == todo.Id);
			if (todo != null)
				todo.Completed = complete;
			return View();
		}

		[ActionSelector]
		public ActionResult Delete(Todo todo)
		{
			HttpContext.Items["todoId"] = StateContext.Bag.id;
			StateContext.Bag.id = null;
			todo = Todos.FirstOrDefault(t => t.Id == todo.Id);
			if (todo != null)
				Todos.Remove(todo);
			return View();
		}

		[ActionSelector]
		public ActionResult ToggleAll(bool complete)
		{
			HttpContext.Items["refresh"] = true;
			StateContext.Bag.id = null;
			Todos.ForEach(t => t.Completed = complete);
			return View();
		}

		[ActionSelector]
		public ActionResult ClearCompleted()
		{
			HttpContext.Items["refresh"] = true;
			StateContext.Bag.id = null;
			var completed = Todos.Where(t => t.Completed).ToList();
			completed.ForEach(t => Todos.Remove(t));
			return View();
		}
	}
}