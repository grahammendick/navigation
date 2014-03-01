using Microsoft.VisualStudio.Modeling;

namespace Navigation.Designer
{
	[RuleOn(typeof(Transition))]
	public class TransitionCreation : AddRule
	{
		public override void ElementAdded(ElementAddedEventArgs e)
		{
			Transition transition = (Transition)e.ModelElement;
			if (transition.Successor != null)
				transition.Successor.Initial = false;
		}
	}
}
