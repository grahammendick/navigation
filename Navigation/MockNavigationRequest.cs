using System;
using System.Collections.Specialized;
using System.Web;
using System.Web.Routing;

namespace Navigation
{
	internal class MockNavigationRequest : HttpRequestBase
	{
		private string _Path;
		private string _RawUrl;
		private int? _QueryStringIndex;
		private NameValueCollection _QueryString;

		internal MockNavigationRequest(string url)
			: base()
		{
			_RawUrl = url;
		}

		private int QueryStringIndex
		{
			get
			{
				if (!_QueryStringIndex.HasValue)
				{
					_QueryStringIndex = RawUrl.IndexOf("?", StringComparison.Ordinal);
					_QueryStringIndex = _QueryStringIndex < 0 ? RawUrl.Length : _QueryStringIndex;
				}
				return _QueryStringIndex.Value;
			}
		}

		public override string Path
		{
			get
			{
				if (_Path == null)
					_Path = RawUrl.Substring(0, QueryStringIndex);
				return _Path;
			}
		}

		public override string ApplicationPath
		{
			get
			{
				return "/";
			}
		}

		public override string RawUrl
		{
			get
			{
				return _RawUrl;
			}
		}

		public override string AppRelativeCurrentExecutionFilePath
		{
			get
			{
				return "~" + Path;
			}
		}

		public override string PathInfo
		{
			get
			{
				return string.Empty;
			}
		}

		public override NameValueCollection QueryString
		{
			get
			{
				if (_QueryString == null)
					_QueryString = HttpUtility.ParseQueryString(RawUrl.Substring(QueryStringIndex));
				return _QueryString;
			}
		}

		public override RequestContext RequestContext
		{
			get;
			set;
		}
	}
}
