using System;
using System.IO;

namespace Navigation
{
	/// <summary>
	/// Represents an HTML refresh navigation anchor element
	/// </summary>
	public class RefreshLink : IDisposable
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="RefreshLink"/> class
		/// </summary>
		/// <param name="writer">The text writer the HTML is written to</param>
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

		/// <summary>
		/// Finishes rendering of the refresh navigation anchor element
		/// </summary>
		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		/// <summary>
		/// Finishes rendering of the refresh navigation anchor element
		/// </summary>
		/// <param name="disposing">Finishes rendering if true</param>
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
