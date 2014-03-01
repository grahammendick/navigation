using Microsoft.VisualStudio.Modeling;

namespace Navigation.Designer
{
	[RuleOn(typeof(Transition))]
	public class TransitionDeletion : DeleteRule
	{
		public override void ElementDeleted(ElementDeletedEventArgs e)
		{
			Transition transition = (Transition)e.ModelElement;
			if (transition.Successor != null && transition.Successor.Predecessors.Count == 0)
				transition.Successor.Initial = true;
		}
	}
}
