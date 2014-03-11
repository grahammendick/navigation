using Microsoft.VisualStudio.Modeling;
using System.Text.RegularExpressions;

namespace Navigation.Designer
{
	[RuleOn(typeof(State))]
	public sealed class StateKeyChange : ChangeRule
	{
		private static Regex defaultKeyExp = new Regex(@"^State\d+$");

		public override void ElementPropertyChanged(ElementPropertyChangedEventArgs e)
		{
			State state = (State)e.ModelElement;
			if (e.DomainProperty.Id == State.KeyDomainPropertyId)
			{
				string oldValue = (string)e.OldValue;
				string newValue = (string)e.NewValue;
				if (defaultKeyExp.Match(oldValue).Success)
				{
					if (state.Page == string.Format("~/{0}.aspx", e.OldValue))
						state.Page = string.Format("~/{0}.aspx", e.NewValue);
					if (state.Route == oldValue)
						state.Route = newValue;
					if (state.DialogKey == oldValue)
						state.DialogKey = newValue;
				}
			}
		}
	}
}
