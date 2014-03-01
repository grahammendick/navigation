using Microsoft.VisualStudio.Modeling;

namespace Navigation.Designer
{
	[RuleOn(typeof(Transition), FireTime = TimeToFire.TopLevelCommit)]
	public class TransitionDeletion : DeleteRule
	{
		public override void ElementDeleted(ElementDeletedEventArgs e)
		{
			Transition transition = (Transition)e.ModelElement;
			if (!transition.Successor.IsDeleted && transition.Successor.Predecessors.Count == 0
				&& !transition.Store.TransactionManager.CurrentTransaction.IsSerializing)
				transition.Successor.Initial = true;
		}
	}
}
