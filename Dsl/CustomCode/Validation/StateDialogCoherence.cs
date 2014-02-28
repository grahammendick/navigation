using Microsoft.VisualStudio.Modeling;

namespace Navigation.Designer
{
	[RuleOn(typeof(State))]
	public sealed class StateDialogCoherence : ChangeRule
	{
		public override void ElementPropertyChanged(ElementPropertyChangedEventArgs e)
		{
			State state = (State)e.ModelElement;
			if (e.DomainProperty.Id == State.InitialDomainPropertyId)
			{
				if ((bool)e.NewValue)
				{
					if (string.IsNullOrEmpty(state.DialogKey))
						state.DialogKey = state.Key;
					if (string.IsNullOrEmpty(state.Path))
						state.Path = state.Page;
				}
			}
		}
	}
}
