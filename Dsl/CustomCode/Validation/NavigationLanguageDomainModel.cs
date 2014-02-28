using System;

namespace Navigation.Designer
{
	public partial class NavigationLanguageDomainModel
	{
		protected override Type[] GetCustomDomainModelTypes()
		{
			return new Type[]{
				typeof(StateDialogCoherence),
				typeof(StateCreation),
				typeof(TransitionDialogCoherence.TransitionCreation),
				typeof(TransitionDialogCoherence.TransitionDeletion)
			};
		}
	}
}
