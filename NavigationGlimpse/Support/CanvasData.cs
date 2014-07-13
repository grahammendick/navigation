using Navigation.Glimpse.Model;
using System.Collections.Generic;

namespace Navigation.Glimpse.Support
{
	public class CanvasData
	{
		public List<StateModel> States { get; set; }

		public List<TransitionModel> Transitions { get; set; }

		public int X { get; set; }

		public int Y { get; set; }

		public int W { get; set; }

		public int H { get; set; }
	}
}
