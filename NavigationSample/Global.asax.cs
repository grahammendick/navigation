using System;
using System.Web;

namespace Navigation.Sample
{
	public class Global : HttpApplication
	{
		protected void Application_Start(object sender, EventArgs e)
		{
			FluentStateInfoConfig.Register(StateInfoConfig.Fluent);
		}
	}
}