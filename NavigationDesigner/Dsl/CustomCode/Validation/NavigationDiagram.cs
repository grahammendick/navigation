using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualStudio.Modeling.Validation;
using Navigation.Designer.CustomCode.Validation;

namespace Navigation.Designer
{
	[ValidationState(ValidationState.Enabled)]
	public partial class NavigationDiagram
	{
		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void Validate(ValidationContext context)
		{
			StateInfo stateInfo = new StateInfo();
			List<Dialog> dialogs = stateInfo.Convert(this);
			var qd = from d in dialogs
					 where !string.IsNullOrEmpty(d.Key)
					 group d.Initial by d.Key into g
					 where g.Count() > 1
					 select g;
			foreach (var d in qd)
			{
				context.LogError(string.Format(Messages.DuplicateDialogKey, d.Key), "DuplicateDialogKey", d.ToArray());
			}
			foreach (Dialog dialog in dialogs)
			{
				if (!dialog.Initial.Initial)
					context.LogError(string.Format(Messages.StateDialogNotInitial, dialog.Initial.Key), "StateDialogNotInitial", dialog.Initial);

				var q = from s in dialog.States
						where !string.IsNullOrEmpty(s.Key)
						group s.State by s.Key into g
						where g.Count() > 1
						select g;
				foreach (var s in q)
				{
					context.LogError(string.Format(Messages.DuplicateStateKey, dialog.Key, s.Key), "DuplicateStateKey", s.ToArray());
				}
			}
			if (dialogs.Count > 0)
			{
				bool noPathOrRoute = dialogs.Where(d => !string.IsNullOrEmpty(d.Path + d.Initial.Route)).FirstOrDefault() == null;
				if (noPathOrRoute)
				{
					context.LogError(Messages.PathAndRouteEmpty, "PathAndRouteEmpty", (dialogs.Select(d => d.Initial).ToArray()));
				}
			}
		}
	}
}
