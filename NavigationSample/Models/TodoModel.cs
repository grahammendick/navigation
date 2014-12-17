using System.Collections.Generic;

namespace Navigation.Sample.Models
{
	public class TodoModel
	{
		public string Title { get; set; }

		public IEnumerable<Todo> Todos { get; set; }
	}
}