using System.Web.UI;
using System.Web.UI.WebControls;

namespace Navigation.Sample
{
	public partial class Details : Page
	{
		protected void FormView1_CallingDataMethods(object sender, CallingDataMethodsEventArgs e)
		{
			e.DataMethodsObject = new PersonSearch();
		}
	}
}