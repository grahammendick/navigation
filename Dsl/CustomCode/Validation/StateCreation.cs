using Microsoft.VisualStudio.Modeling;
using System.Collections.Generic;
using System.Linq;

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
				state.Initial = true;
				state.Page = string.Format("~/{0}.aspx", state.Key);
				state.Route = string.Format("{0}Route", state.Key);
				state.DialogKey = string.Format("{0}Dialog", state.Key);
			}
		}
	}
}
