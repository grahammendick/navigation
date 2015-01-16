using Glimpse.Core.Extensibility;

namespace Navigation.Glimpse.Inspector
{
	public class StateHandlerInspector : IInspector
	{
		public void Setup(IInspectorContext context)
		{
			AlternateType.StateHandler alternateBaseImplementation = new AlternateType.StateHandler(context.ProxyFactory);
			IStateHandler originalHandler = null;
			if (StateInfoConfig.Dialogs != null)
			{
				foreach (Dialog dialog in StateInfoConfig.Dialogs)
				{
					foreach (State state in dialog.States)
					{
						originalHandler = state.StateHandler;
						if (originalHandler != null)
						{
							IStateHandler newHandler = null;
							alternateBaseImplementation.TryCreate(originalHandler, out newHandler);
							state.StateHandler = newHandler;
							context.Logger.Info(Resources.StateSetupReplacedStateHandler, dialog.Key, state.Key);
						}
					}
				}
			}
		}
	}
}
