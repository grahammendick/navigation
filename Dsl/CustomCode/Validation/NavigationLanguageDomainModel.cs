using System;

namespace Navigation.Designer
{
	public partial class NavigationLanguageDomainModel
	{
		protected override Type[] GetCustomDomainModelTypes()
		{
			return new Type[]{
				typeof(StateCreation),
				typeof(TransitionCreation),
				typeof(TransitionDeletion)
			};
		}
	}
}
