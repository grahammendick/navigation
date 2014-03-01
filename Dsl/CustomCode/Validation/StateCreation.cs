using Microsoft.VisualStudio.Modeling;

namespace Navigation.Designer
{
	[RuleOn(typeof(State), FireTime = TimeToFire.TopLevelCommit)]
	public sealed class StateCreation : AddRule
	{
		public override void ElementAdded(ElementAddedEventArgs e)
		{
			State state = (State)e.ModelElement;
			if (!state.Store.TransactionManager.CurrentTransaction.IsSerializing)
			{
				int stateCount = state.Partition.ElementDirectory.FindElements<State>().Count;
				state.Page = string.Format("~/{0}.aspx", state.Key);
				state.Initial = true;
				state.DialogKey = "Dialog" + stateCount;
				state.Route = "Route" + stateCount;
			}
		}
	}
}
