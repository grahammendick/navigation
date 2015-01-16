using System;
using System.Collections.Generic;
using System.Web;

namespace Navigation.Sample.Models
{
	public class TodoModel
	{
		public string NewTitle { get; set; }

		public IEnumerable<Todo> Todos { get; set; }

		public int ItemsLeft { get; set; }

		public int CompletedCount { get; set; }

		public bool Empty
		{
			get
			{
				return ItemsLeft == 0 && CompletedCount == 0;
			}
		}

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

		public string ToggleAllComplete
		{
			get
			{
				return ItemsLeft == 0 ? "false" : "true";
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

		public Func<HttpContextBase, NavigationData, NavigationData, bool> Changed
		{
			get
			{
				return (context, fromData, toData) => 
					context.Items["refresh"] != null || fromData.Bag.mode != toData.Bag.mode;
			}
		}

		public Func<HttpContextBase, NavigationData, NavigationData, bool> Refresh
		{
			get
			{
				return (context, fromData, toData) => context.Items["edit"] == null;
			}
		}
	}
}