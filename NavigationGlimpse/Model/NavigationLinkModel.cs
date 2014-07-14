using System.Collections.Generic;

namespace Navigation.Glimpse.Model
{
	public class NavigationLinkModel
	{
		public NavigationLinkModel(string link, IDictionary<string, string> data)
		{
			Link = link;
			Data = data;
		}

		public string Link { get; private set; }

		public IDictionary<string, string> Data { get; set; }
	}
}
