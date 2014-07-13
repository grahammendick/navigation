using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation.Sample
{
	public partial class Listing : Page
	{
		protected void GridView1_CallingDataMethods(object sender, CallingDataMethodsEventArgs e)
		{
			e.DataMethodsObject = new PersonSearch();
		}
	}
}