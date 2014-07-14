using Glimpse.Core.Extensibility;
using Glimpse.Core.Extensions;
using Glimpse.Core.Message;
using System.Collections.Generic;
using System.Collections.Specialized;

namespace Navigation.Glimpse.AlternateType
{
	public class StateHandler : AlternateType<IStateHandler>
	{
		private IEnumerable<IAlternateMethod> allMethods;

		public StateHandler(IProxyFactory proxyFactory)
			: base(proxyFactory)
		{
		}

		public override IEnumerable<IAlternateMethod> AllMethods
		{
			get
			{
				return allMethods ?? (allMethods = new List<IAlternateMethod>
                    {
						new GetNavigationLink()
                    });
			}
		}

		public class GetNavigationLink : AlternateMethod
		{
			public GetNavigationLink()
				: base(typeof(IStateHandler), "GetNavigationLink")
			{
			}

			public override void PostImplementation(IAlternateMethodContext context, TimerResult timerResult)
			{
				var link = context.ReturnValue as string;
				var state = context.Arguments[0] as State;
				var data = ((NameValueCollection) context.Arguments[1]).ToDictionary();
				data.Remove(NavigationSettings.Config.StateIdKey);
				data.Remove(NavigationSettings.Config.PreviousStateIdKey);
				data.Remove(NavigationSettings.Config.ReturnDataKey);
				data.Remove(NavigationSettings.Config.CrumbTrailKey);
				context.MessageBroker.Publish(new Message(link, state, data));
			}

			public class Message : MessageBase
			{
				public Message(string link, State state, IDictionary<string, string> data)
				{
					Link = link;
					State = state;
					Data = data;
				}

				public string Link { get; set; }

				public State State { get; set; }

				public IDictionary<string, string> Data { get; set; }
			}
		}
	}
}
