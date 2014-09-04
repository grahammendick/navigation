#if NET40Plus
using System.Collections.Generic;
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
				var toData = new Dictionary<string, object>();
				foreach (NavigationDataItem item in new NavigationData(true))
				{
					if (!item.Value.Equals(string.Empty) && !StateContext.State.DefaultOrDerived(item.Key, item.Value))
						toData[item.Key] = item.Value;
				}
				StateController.NavigateLink(State, link, NavigationMode.Mock);
				var currentData = new NavigationData(true);
				var includeCurrentData = false;
				if (queryString["includecurrent"] != null)
					includeCurrentData = bool.Parse(queryString["includecurrent"]);
				var currentDataKeys = GetCurrentDataKeyEnumerator(queryString["currentkeys"] ?? string.Empty);
				if (includeCurrentData)
				{
					foreach (var removeKey in currentDataKeys)
						StateContext.Data[removeKey] = null;
				}
				else
				{
					StateContext.Data.Clear();
				}
				foreach (var item in toData)
					StateContext.Data[item.Key] = item.Value;
				RefreshAjaxInfo.GetInfo(requestContext.HttpContext).Data = currentData;
			}
			return base.GetHttpHandler(requestContext);
		}

		private static IEnumerable<string> GetCurrentDataKeyEnumerator(string currentDataKeys)
		{
			if (currentDataKeys.Length == 0)
				yield break;
			foreach (string key in currentDataKeys.Split(new char[] { ',' }))
			{
				yield return key.Trim();
			}
		}
	}
}
#endif
