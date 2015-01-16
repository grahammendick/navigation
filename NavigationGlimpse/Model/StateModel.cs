using System.Collections.Generic;

namespace Navigation.Glimpse.Model
{
	public class StateModel
	{
		public StateModel(State state)
		{
			State = state;
		}

		public State State { get; private set; }

		public int X { get; set; }

		public int Y { get; set; }

		public int W { get; set; }

		public int H { get; set; }

		public bool Current { get; set; }

		public bool Previous { get; set; }

		public int Back { get; set; }

		public NavigationData Data { get; set; }

		public string Page { get; set; }

		public string Controller { get; set; }

		public string ApiController { get; set; }

		public string Action { get; set; }

		public string Route { get; set; }

		public string Theme { get; set; }

		public List<string> Masters { get; set; }

		public List<NavigationLinkModel> NavigationLinks { get; set; }
	}
}

