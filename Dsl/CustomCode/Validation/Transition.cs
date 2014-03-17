using Microsoft.VisualStudio.Modeling.Validation;
using Navigation.Designer.CustomCode.Validation;

namespace Navigation.Designer
{
	[ValidationState(ValidationState.Enabled)]
	public partial class Transition
	{
		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateKey(ValidationContext context)
		{
			if (string.IsNullOrEmpty(Key))
			{
				context.LogError(Messages.TransitionKeyEmpty, "TransitionKeyEmpty", this);
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateNoTransitionWithBackToNoTrackState(ValidationContext context)
		{
			if (CanNavigateBack && !Successor.TrackCrumbTrail)
				context.LogError(string.Format(Messages.TransitionWithBackToNoTrackState, Key, Successor.Key), "TransitionWithBackToNoTrackState", this);
		}
	}
}
