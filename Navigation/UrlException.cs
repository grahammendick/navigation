using System;
using System.Runtime.Serialization;
using Navigation.Properties;

namespace Navigation
{
	/// <summary>
	/// The exception thrown when an invalid Url is received. Invalid Urls must be as a result of
	/// tampering and are typically detected by a custom <see cref="Navigation.NavigationShield"/>
	/// (or <see cref="Navigation.ChecksumNavigationShield"/>); also detected when a query string
	/// parameter cannot be converted using the discovered <see cref="System.ComponentModel.TypeConverter"/>
	/// </summary>
	[Serializable]
	public class UrlException : Exception
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.UrlException"/> class, setting 
		/// the message of the new instance to a system-supplied message that takes into account the 
		/// current system culture
		/// </summary>
		public UrlException()
			: base(Resources.InvalidUrl)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.UrlException"/> class with the
		/// specified error message
		/// </summary>
		/// <param name="message">A <see cref="System.String"/> that describes the error. The content 
		/// of <paramref name="message"/> is intended to be understood by humans. The caller of this 
		/// constructor is required to ensure that this string has been localized for the current system 
		/// culture</param>
		public UrlException(string message)
			: base(message)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.UrlException"/> class with serialized
		/// data
		/// </summary>
		/// <param name="message">A <see cref="System.String"/> that describes the error. The content 
		/// of <paramref name="message"/> is intended to be understood by humans. The caller of this 
		/// constructor is required to ensure that this string has been localized for the current system 
		/// culture</param>
		/// <param name="innerException">The exception that is the cause of the current exception. If 
		/// the <paramref name="innerException"/> is not a null reference, the current exception is raised 
		/// in a catch block that handles the inner exception</param>
		public UrlException(string message, Exception innerException)
			: base(message, innerException)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.UrlException"/> class with serialized
		/// data
		/// </summary>
		/// <param name="info">The object that holds the serialized object data</param>
		/// <param name="context">The contextual information about the source or destination</param>
		protected UrlException(SerializationInfo info, StreamingContext context)
			: base(info, context)
		{
		}
	}
}
