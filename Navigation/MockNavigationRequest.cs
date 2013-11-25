#if NET40Plus
using System;
using System.Collections.Specialized;
using System.Linq;
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
		private string _AppRelativeCurrentExecutionFilePath;
		private RequestContext _RequestContext;

		internal MockNavigationRequest(HttpContextBase context, string url)
			: base()
		{
			Context = context;
			_RawUrl = url;
		}

		private HttpContextBase Context
		{
			get;
			set;
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
				if (_AppRelativeCurrentExecutionFilePath == null)
					_AppRelativeCurrentExecutionFilePath = VirtualPathUtility.ToAppRelative(Path, ApplicationPath);
				return _AppRelativeCurrentExecutionFilePath;
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
			get
			{
				if (_RequestContext == null)
				{
					if (RawUrl != null)
					{
						RouteData routeData = RouteTable.Routes.GetRouteData(Context) ?? new RouteData();
						foreach (string key in routeData.Values.Keys.ToArray())
						{
							routeData.Values[key] = HttpUtility.UrlDecode((string)routeData.Values[key]);
						}
						_RequestContext = new RequestContext(Context, routeData);
					}
					else
					{
						_RequestContext = new RequestContext(Context, new RouteData());
					}
				}
				return _RequestContext;
			}
		}
	}
}
#endif