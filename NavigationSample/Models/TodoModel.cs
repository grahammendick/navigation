using System.Collections.Generic;

namespace Navigation.Sample.Models
{
	public class TodoModel
	{
		public string NewTitle { get; set; }

		public IEnumerable<Todo> Todos { get; set; }

		public int ItemsLeft { get; set; }

		public int CompletedCount { get; set; }

		public string ToggleAll
		{
			get
			{
				return ItemsLeft == 0 ? "activateAll" : "completeAll";
			}
		}

		public string ToggleAllText
		{
			get
			{
				return ItemsLeft == 0 ? "Mark all as active" : "Mark all as complete";
			}
		}

		private string GetSelected(string mode)
		{
			return StateContext.Bag.mode == mode ? "selected" : null;
		}

		public string AllSelected
		{
			get
			{
				return GetSelected("all");
			}
		}

		public string ActiveSelected
		{
			get
			{
				return GetSelected("active");
			}
		}

		public string CompletedSelected
		{
			get
			{
				return GetSelected("completed");
			}
		}
	}
}