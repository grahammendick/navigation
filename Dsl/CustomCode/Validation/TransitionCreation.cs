using Microsoft.VisualStudio.Modeling;

namespace Navigation.Designer
{
	[RuleOn(typeof(Transition), FireTime = TimeToFire.TopLevelCommit)]
	public class TransitionCreation : AddRule
	{
		public override void ElementAdded(ElementAddedEventArgs e)
		{
			Transition transition = (Transition)e.ModelElement;
			if (transition.Successor.Predecessors.Count == 1 && !transition.Store.TransactionManager.CurrentTransaction.IsSerializing)
				transition.Successor.Initial = false;
		}
	}
}
