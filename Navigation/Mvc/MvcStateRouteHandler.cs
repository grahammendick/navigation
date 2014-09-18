#if NET40Plus
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Navigation
{
	/// <summary>
	/// Creates the <see cref="StateContext"/> for the MVC <see cref="State"/>
	/// </summary>
	public class MvcStateRouteHandler : MvcRouteHandler
	{
		private MvcStateRouteHandler()
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="MvcStateRouteHandler"/> class
		/// </summary>
		/// <param name="state">The <see cref="State"/> this route handler is associated with</param>
		protected internal MvcStateRouteHandler(State state)
		{
			State = state;
		}

		/// <summary>
		/// Gets the <see cref="State"/> this route handler is associated with
		/// </summary>
		public State State
		{
			get;
			private set;
		}

		/// <summary>
		/// Returns the object that processes the request
		/// </summary>
		/// <param name="requestContext">An object that encapsulates information about the request</param>
		/// <returns>The object that processes the request</returns>
		protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
		{
			StateController.SetStateContext(State.Id, requestContext.HttpContext);
			var queryString = requestContext.HttpContext.Request.QueryString;
			var link = queryString["refreshajax"];
			if (link != null)
			{
				var toData = new NavigationData(true);
				StateController.NavigateLink(State, link, NavigationMode.Mock);
				RefreshAjaxInfo.GetInfo(requestContext.HttpContext).Data = new NavigationData(true);
				var includeCurrentData = false;
				bool.TryParse(queryString["includecurrent"], out includeCurrentData);
				if (!includeCurrentData)
				{
					var currentDataKeys = GetDataKeyEnumerator(queryString["currentkeys"]);
					var currentData = new NavigationData(currentDataKeys);
					StateContext.Data.Clear();
					StateContext.Data.Add(currentData);
				}
				UpdateData(queryString, toData);
			}
			return base.GetHttpHandler(requestContext);
		}

		private static void UpdateData(NameValueCollection queryString, NavigationData toData)
		{
			if (queryString["navigation"] != "history")
			{
				var toDataKeys = GetDataKeyEnumerator(queryString["tokeys"]);
				foreach (var toDataKey in toDataKeys)
					StateContext.Data[toDataKey] = toData[toDataKey];
			}
			else
				StateContext.Data.Add(toData);
		}

		private static IEnumerable<string> GetDataKeyEnumerator(string dataKeys)
		{
			if (dataKeys == null || dataKeys.Length == 0)
				yield break;
			foreach (string key in dataKeys.Split(','))
			{
				yield return key.Trim();
			}
		}
	}
}
#endif
