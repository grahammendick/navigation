using Glimpse.Core.Extensibility;
using Glimpse.Core.Message;
using System.Collections.Generic;
using System.Reflection;
using System.Web.WebPages;

namespace NavigationGlimpse.AlternateType
{
	public class StateRouteHandler : AlternateType<Navigation.StateRouteHandler>
	{
		private IEnumerable<IAlternateMethod> allMethods;

		public StateRouteHandler(IProxyFactory proxyFactory)
			: base(proxyFactory)
		{
		}

		public override IEnumerable<IAlternateMethod> AllMethods
		{
			get
			{
				return allMethods ?? (allMethods = new List<IAlternateMethod>
                    {
                        new GetDisplayInfoForPage(),
                        new GetPageForDisplayInfo(),
                        new GetDisplayInfoForMaster(),
                        new GetMasterForDisplayInfo(),
                        new GetDisplayInfoForTheme(),
                        new GetThemeForDisplayInfo()
                    });
			}
		}

		public class GetDisplayInfoForPage : AlternateMethod
		{
			public GetDisplayInfoForPage()
				: base(typeof(Navigation.StateRouteHandler), "GetDisplayInfoForPage", BindingFlags.NonPublic | BindingFlags.Instance)
			{
			}

			public override void PostImplementation(IAlternateMethodContext context, TimerResult timerResult)
			{
				var displayInfo = context.ReturnValue as DisplayInfo;
				var message = new Message(displayInfo.DisplayMode.DisplayModeId, displayInfo.FilePath);
				context.MessageBroker.Publish(message);
			}

			public class Message : MessageBase
			{
				public Message(string displayMode, string page)
				{
					DisplayMode = displayMode;
					Page = page;
				}

				public string DisplayMode { get; set; }

				public string Page { get; set; }
			}
		}

		public class GetPageForDisplayInfo : AlternateMethod
		{
			public GetPageForDisplayInfo()
				: base(typeof(Navigation.StateRouteHandler), "GetPageForDisplayInfo", BindingFlags.NonPublic | BindingFlags.Instance)
			{
			}

			public override void PostImplementation(IAlternateMethodContext context, TimerResult timerResult)
			{
				var displayInfo = context.Arguments[0] as DisplayInfo;
				var page = context.ReturnValue as string;
				var message = new Message(displayInfo.DisplayMode.DisplayModeId, page);
				context.MessageBroker.Publish(message);
			}

			public class Message : MessageBase
			{
				public Message(string displayMode, string page)
				{
					DisplayMode = displayMode;
					Page = page;
				}

				public string DisplayMode { get; set; }

				public string Page { get; set; }
			}
		}

		public class GetDisplayInfoForMaster : AlternateMethod
		{
			public GetDisplayInfoForMaster()
				: base(typeof(Navigation.StateRouteHandler), "GetDisplayInfoForMaster", BindingFlags.NonPublic | BindingFlags.Instance)
			{
			}

			public override void PostImplementation(IAlternateMethodContext context, TimerResult timerResult)
			{
				var displayInfo = context.ReturnValue as DisplayInfo;
				var message = new Message(displayInfo.DisplayMode.DisplayModeId, displayInfo.FilePath);
				context.MessageBroker.Publish(message);
			}

			public class Message : MessageBase
			{
				public Message(string displayMode, string master)
				{
					DisplayMode = displayMode;
					Master = master;
				}

				public string DisplayMode { get; set; }

				public string Master { get; set; }
			}
		}

		public class GetMasterForDisplayInfo : AlternateMethod
		{
			public GetMasterForDisplayInfo()
				: base(typeof(Navigation.StateRouteHandler), "GetMasterForDisplayInfo", BindingFlags.NonPublic | BindingFlags.Instance)
			{
			}

			public override void PostImplementation(IAlternateMethodContext context, TimerResult timerResult)
			{
				var displayInfo = context.Arguments[0] as DisplayInfo;
				var master = context.ReturnValue as string;
				var message = new Message(displayInfo.DisplayMode.DisplayModeId, master);
				context.MessageBroker.Publish(message);
			}

			public class Message : MessageBase
			{
				public Message(string displayMode, string master)
				{
					DisplayMode = displayMode;
					Master = master;
				}

				public string DisplayMode { get; set; }

				public string Master { get; set; }
			}
		}

		public class GetDisplayInfoForTheme : AlternateMethod
		{
			public GetDisplayInfoForTheme()
				: base(typeof(Navigation.StateRouteHandler), "GetDisplayInfoForTheme", BindingFlags.NonPublic | BindingFlags.Instance)
			{
			}

			public override void PostImplementation(IAlternateMethodContext context, TimerResult timerResult)
			{
				var displayInfo = context.ReturnValue as DisplayInfo;
				var message = new Message(displayInfo.DisplayMode.DisplayModeId, displayInfo.FilePath);
				context.MessageBroker.Publish(message);
			}

			public class Message : MessageBase
			{
				public Message(string displayMode, string theme)
				{
					DisplayMode = displayMode;
					Theme = theme;
				}

				public string DisplayMode { get; set; }

				public string Theme { get; set; }
			}
		}

		public class GetThemeForDisplayInfo : AlternateMethod
		{
			public GetThemeForDisplayInfo()
				: base(typeof(Navigation.StateRouteHandler), "GetThemeForDisplayInfo", BindingFlags.NonPublic | BindingFlags.Instance)
			{
			}

			public override void PostImplementation(IAlternateMethodContext context, TimerResult timerResult)
			{
				var displayInfo = context.Arguments[0] as DisplayInfo;
				var theme = context.ReturnValue as string;
				var message = new Message(displayInfo.DisplayMode.DisplayModeId, theme);
				context.MessageBroker.Publish(message);
			}

			public class Message : MessageBase
			{
				public Message(string displayMode, string theme)
				{
					DisplayMode = displayMode;
					Theme = theme;
				}

				public string DisplayMode { get; set; }

				public string Theme { get; set; }
			}
		}
	}
}