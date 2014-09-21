using System;
using System.IO;

namespace Navigation
{
	public class RefreshLink : IDisposable
	{
		public RefreshLink(TextWriter writer)
		{
			Writer = writer;
		}

		private TextWriter Writer
		{
			get;
			set;
		}

		private bool Disposed
		{
			get;
			set;
		}

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		protected virtual void Dispose(bool disposing)
		{
			if (!Disposed)
			{
				Disposed = true;
				Writer.Write("</a>");
			}
		}
	}
}
