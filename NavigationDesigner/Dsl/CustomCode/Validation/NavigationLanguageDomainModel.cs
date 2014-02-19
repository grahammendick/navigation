using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Navigation.Designer
{
	public partial class NavigationLanguageDomainModel
	{
		protected override Type[] GetCustomDomainModelTypes()
		{
			return new Type[]{
				typeof(StateDialogCoherence)
			};
		}
	}
}
