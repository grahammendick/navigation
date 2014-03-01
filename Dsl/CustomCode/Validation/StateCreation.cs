using Microsoft.VisualStudio.Modeling;

namespace Navigation.Designer
{
	[RuleOn(typeof(State))]
	public sealed class StateCreation : AddRule
	{
		public override void ElementAdded(ElementAddedEventArgs e)
		{
			State state = (State)e.ModelElement;
			if (!string.IsNullOrEmpty(state.Key))
			{
				state.Page = string.Format("~/{0}.aspx", state.Key);
				state.Initial = true;
				state.DialogKey = state.Key;
				state.Route = state.Key;
			}
		}
	}
}
