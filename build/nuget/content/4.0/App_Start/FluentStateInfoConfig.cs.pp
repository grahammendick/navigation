using Navigation;

[assembly: WebActivatorEx.PreApplicationStartMethod(
    typeof($rootnamespace$.FluentStateInfoConfig), "Register")]
namespace $rootnamespace$
{
    public class FluentStateInfoConfig
    {
        /// <summary>
        /// This method is where you configure your navigation. You can find out more
        /// about it by heading over to http://navigation.codeplex.com/documentation
        /// To get you started here's an example
        /// </summary>
        public static void Register()
        {
            //StateInfoConfig.Fluent
            //    .Dialog("Thingamabob", new
            //    {
            //        Listing = new WebFormsState("listing", "~/Listing.aspx"),
            //        Details = new MvcState("details", "Thingamabob", "Details")
            //    }, d => d.Listing)
            //        .Transition("Select", d => d.Listing, d => d.Details)
            //    .Build();
        }
    }
}