using System.Collections.Specialized;

namespace Navigation.Glimpse.Model
{
	public class NavigationLinkModel
	{
		public NavigationLinkModel(string link, NameValueCollection data)
		{
			Link = link;
			Data = data;
		}

		public string Link { get; private set; }

		public NameValueCollection Data { get; set; }
	}
}
