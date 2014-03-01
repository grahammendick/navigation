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
			if (e.DomainProperty.Id == State.KeyDomainPropertyId && defaultKeyExp.Match((string)e.OldValue).Success)
			{
				if (state.Page == string.Format("~/{0}Page.aspx", e.OldValue))
					state.Page = string.Format("~/{0}Page.aspx", e.NewValue);
				if (state.Route == string.Format("{0}Route", e.OldValue))
					state.Route = string.Format("{0}Route", e.NewValue);
				if (state.DialogKey == string.Format("{0}Dialog", e.OldValue))
					state.DialogKey = string.Format("{0}Dialog", e.NewValue);
			}
		}
	}
}
