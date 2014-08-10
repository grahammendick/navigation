using Resources;
namespace Navigation.Sample
{
	public class FluentStateInfoConfig
	{
		public static void Register(FluentStateInfo stateInfo)
		{
			stateInfo
				.Dialog("Person", new
				{
					Listing = new WebFormsState("List/{startRowIndex}/{maximumRows}/{sortExpression}", "~/Listing.aspx")
						.Title(() => StateInfo.Listing)
						.Defaults(new { startRowIndex = 0, maximumRows = 10, sortExpression = "Name" })
						.Derived("totalRowCount")
						.TrackCrumbTrail(false),
					Details = new WebFormsState("Person", "~/Details.aspx")
						.Title(() => StateInfo.Details)
				}, d => d.Listing)
					.Transition("Select", d => d.Listing, d => d.Details)
				.Dialog("MvcPerson", new
				{
					Listing = new MvcState("MvcList/{startRowIndex}/{maximumRows}/{sortExpression}", "Person", "List")
						.Title(() => StateInfo.Listing)
						.Defaults(new { startRowIndex = 0, maximumRows = 10, sortExpression = "Name" })
						.Derived("totalRowCount")
						.TrackCrumbTrail(false),
					Details = new MvcState("MvcPerson", "Person", "GetDetails")
						.Title(() => StateInfo.Details)
				}, d => d.Listing)
					.Transition("Select", d => d.Listing, d => d.Details)
				.Dialog("WebApiPerson", new
				{
					Listing = new WebApiState("WebApiList/{startRowIndex}/{maximumRows}/{sortExpression}", "PersonApi", "GetList")
						.Title(() => StateInfo.Listing)
						.Defaults(new { startRowIndex = 0, maximumRows = 10, sortExpression = "Name" })
						.Derived("totalRowCount")
						.TrackCrumbTrail(false),
					Details = new WebApiState("WebApiPerson", "PersonApi", "GetDetails")
						.Title(() => StateInfo.Details)
				}, d => d.Listing)
					.Transition("Select", d => d.Listing, d => d.Details)
				.Build();
		}
	}
}