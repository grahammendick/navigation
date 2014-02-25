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
				if (!(bool)e.NewValue)
				{
					state.DialogKey = string.Empty;
					state.DialogTitle = string.Empty;
					state.DialogResourceType = string.Empty;
					state.DialogResourceKey = string.Empty;
					state.Path = string.Empty;
					state.DialogOrder = 0;
				}
			}
			else
			{
				string key, title, resourceType, resourceKey, path; int order;
				if (e.DomainProperty.Id == State.DialogKeyDomainPropertyId
					|| e.DomainProperty.Id == State.DialogTitleDomainPropertyId
					|| e.DomainProperty.Id == State.DialogResourceTypeDomainPropertyId
					|| e.DomainProperty.Id == State.DialogResourceKeyDomainPropertyId
					|| e.DomainProperty.Id == State.PathDomainPropertyId
					|| e.DomainProperty.Id == State.DialogOrderDomainPropertyId)
				{
					key = e.DomainProperty.Id == State.DialogKeyDomainPropertyId ? (string)e.NewValue : state.DialogKey;
					title = e.DomainProperty.Id == State.DialogTitleDomainPropertyId ? (string)e.NewValue : state.DialogTitle;
					resourceType = e.DomainProperty.Id == State.DialogResourceTypeDomainPropertyId ? (string)e.NewValue : state.DialogResourceType;
					resourceKey = e.DomainProperty.Id == State.DialogResourceKeyDomainPropertyId ? (string)e.NewValue : state.DialogResourceKey;
					path = e.DomainProperty.Id == State.PathDomainPropertyId ? (string)e.NewValue : state.Path;
					order = e.DomainProperty.Id == State.DialogOrderDomainPropertyId ? (int)e.NewValue : state.DialogOrder;

					state.Initial = !string.IsNullOrEmpty(key)
						|| !string.IsNullOrEmpty(title)
						|| !string.IsNullOrEmpty(resourceType)
						|| !string.IsNullOrEmpty(resourceKey)
						|| !string.IsNullOrEmpty(path)
						|| order != 0;
				}
			}
		}
	}
}
