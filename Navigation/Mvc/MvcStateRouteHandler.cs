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
				var toData = GetToData();
				StateController.NavigateLink(State, link, NavigationMode.Mock);
				RefreshAjaxInfo.GetInfo(requestContext.HttpContext).Data = new NavigationData(true);
				var includeCurrentData = false;
				bool.TryParse(queryString["includecurrent"], out includeCurrentData);
				var currentDataKeys = GetCurrentDataKeyEnumerator(queryString["currentkeys"]);
				if (includeCurrentData)
				{
					foreach (var removeKey in currentDataKeys)
						StateContext.Data[removeKey] = null;
				}
				else
				{
					var currentData = new NavigationData(currentDataKeys);
					StateContext.Data.Clear();
					StateContext.Data.Add(currentData);
				}
				StateContext.Data.Add(toData);
			}
			return base.GetHttpHandler(requestContext);
		}

		private static NavigationData GetToData()
		{
			var toData = new NavigationData(true);
			foreach (NavigationDataItem item in StateContext.Data)
			{
				if (item.Value.Equals(string.Empty) || StateContext.State.DefaultOrDerived(item.Key, item.Value))
					toData[item.Key] = null;
			}
			return toData;
		}

		private static IEnumerable<string> GetCurrentDataKeyEnumerator(string currentDataKeys)
		{
			if (currentDataKeys == null || currentDataKeys.Length == 0)
				yield break;
			foreach (string key in currentDataKeys.Split(','))
			{
				yield return key.Trim();
			}
		}
	}
}
#endif
