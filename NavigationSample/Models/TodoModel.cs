using System.Collections.Generic;

namespace Navigation.Sample.Models
{
	public class TodoModel
	{
		public string NewTitle { get; set; }

		public IEnumerable<Todo> Todos { get; set; }
	}
}