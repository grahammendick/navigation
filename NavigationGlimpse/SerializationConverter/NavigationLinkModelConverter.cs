using Glimpse.Core.Extensibility;
using Glimpse.Core.Extensions;
using Navigation.Glimpse.Model;

namespace Navigation.Glimpse.SerializationConverter
{
	public class NavigationLinkModelConverter : SerializationConverter<NavigationLinkModel>
	{
		public override object Convert(NavigationLinkModel navigationLinkModel)
		{
			return new
			{
				navigationLinkModel.Link,
				Data = navigationLinkModel.Data.ToDictionary()
			};
		}
	}
}
