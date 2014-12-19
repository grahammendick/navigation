using System;
using System.Web;

namespace Navigation.Sample.Models
{
	public class Todo
	{
		public int Id { get; set; }

		public string Title { get; set; }

		public bool Completed { get; set; }

		public string Toggle
		{
			get
			{
				return Completed ? "activate" : "complete";
			}
		}

		public string ToggleText
		{
			get
			{
				return Completed ? "Mark as active" : "Mark as complete";
			}
		}

		public Func<HttpContextBase, NavigationData, NavigationData, bool> Changed
		{
			get
			{
				return (context, fromData, toData) => (int?) context.Items["todoId"] == Id ||
					(fromData.Bag.id != toData.Bag.id  && (fromData.Bag.id == Id || toData.Bag.id == Id));
			}
		}
	}
}