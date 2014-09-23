using System.IO;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace Navigation
{
	/// <summary>
	/// Represents an HTML navigation form element
	/// </summary>
	public class NavigationForm : MvcForm
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="NavigationForm"/> class
		/// </summary>
		/// <param name="viewContext">Object encapsulating view rendering information</param>
		/// <param name="writer">The text writer the HTML is written to</param>
		public NavigationForm(ViewContext viewContext, TextWriter writer)
			: base(viewContext)
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

		/// <summary>
		/// Finishes rendering of the navigation form element
		/// </summary>
		/// <param name="disposing">Finishes rendering if true</param>
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
