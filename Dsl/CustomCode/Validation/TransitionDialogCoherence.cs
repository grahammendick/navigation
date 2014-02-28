using Microsoft.VisualStudio.Modeling;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Navigation.Designer
{
	public class TransitionDialogCoherence
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
}
