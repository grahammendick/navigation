using System.IO;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace Navigation
{
	public class NavigationForm : MvcForm
	{
		public NavigationForm(ViewContext viewContext, TextWriter writer) : base(viewContext)
		{
			ViewContext = viewContext;
			Writer = writer;
		}

		private ViewContext ViewContext
		{
			get;
			set;
		}

		private TextWriter Writer
		{
			get;
			set;
		}

		protected override void Dispose(bool disposing)
		{
			var originalWriter = ViewContext.Writer;
			if (Writer != null)
				ViewContext.Writer = Writer;
			base.Dispose(disposing);
			ViewContext.Writer = originalWriter;
		}
	}
}
