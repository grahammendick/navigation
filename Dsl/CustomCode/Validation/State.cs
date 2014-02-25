using Microsoft.VisualStudio.Modeling.Validation;
using Navigation.Designer.CustomCode.Validation;
using System.Linq;
using System.Text.RegularExpressions;

namespace Navigation.Designer
{
	[ValidationState(ValidationState.Enabled)]
	public partial class State
	{
		private static Regex pageExp = new Regex(@"^~/.+\.aspx$");
		private static Regex masterExp = new Regex(@"^~/.+\.master$");
		private static string typesExp = @"(string|bool|short|int|long|float|double|decimal|datetime|byte|char)";
		private static string defaultsKeyValueExp = string.Format(@"\s*[^\s?=,][^?=,]*(\?\s*{0}\s*)?=[^?=,]*", typesExp);
		private static string defaultTypesKeyValueExp = string.Format(@"\s*[^\s=,][^=,]*=\s*{0}\s*", typesExp);
		private static string commaSeparatedListExp = @"^({0})(,{0})*$";
		private static Regex defaultsExp = new Regex(string.Format(commaSeparatedListExp, defaultsKeyValueExp), RegexOptions.IgnoreCase);
		private static Regex defaultTypesExp = new Regex(string.Format(commaSeparatedListExp, defaultTypesKeyValueExp), RegexOptions.IgnoreCase);

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateKey(ValidationContext context)
		{
			if (string.IsNullOrEmpty(Key))
			{
				context.LogError(Messages.StateKeyEmpty, "StateKeyEmpty", this);
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidatePage(ValidationContext context)
		{
			if (string.IsNullOrEmpty(Page))
			{
				context.LogError(string.Format(Messages.StatePageEmpty, Key), "StatePageEmpty", this);
			}
			else
			{
				if (!pageExp.IsMatch(Page))
				{
					context.LogError(string.Format(Messages.StatePageInvalid, Key), "StatePageInvalid", this);
				}
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateMasters(ValidationContext context)
		{
			if (!string.IsNullOrEmpty(Masters))
			{
				foreach (string master in Regex.Split(Masters, ","))
				{
					if (!masterExp.IsMatch(master))
					{
						context.LogError(string.Format(Messages.StateMastersInvalid, Key), "StateMastersInvalid", this);
						break;
					}
				}
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateTitleAndResource(ValidationContext context)
		{
			if (!string.IsNullOrEmpty(Title) && (!string.IsNullOrEmpty(ResourceType) || !string.IsNullOrEmpty(ResourceKey)))
			{
				context.LogError(string.Format(Messages.StateTitleAndResourceInvalid, Key), "StateTitleAndResourceInvalid", this);
			}
			else
			{
				if ((!string.IsNullOrEmpty(ResourceType) && string.IsNullOrEmpty(ResourceKey))
					|| (string.IsNullOrEmpty(ResourceType) && !string.IsNullOrEmpty(ResourceKey)))
				{
					context.LogError(string.Format(Messages.StateResourceInvalid, Key), "StateResourceInvalid", this);
				}
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateDialogTitleAndResource(ValidationContext context)
		{
			if (!string.IsNullOrEmpty(DialogTitle) && (!string.IsNullOrEmpty(DialogResourceType) || !string.IsNullOrEmpty(DialogResourceKey)))
			{
				context.LogError(string.Format(Messages.DialogTitleAndResourceInvalid, Key), "DialogTitleAndResourceInvalid", this);
			}
			else
			{
				if ((!string.IsNullOrEmpty(DialogResourceType) && string.IsNullOrEmpty(DialogResourceKey))
					|| (string.IsNullOrEmpty(DialogResourceType) && !string.IsNullOrEmpty(DialogResourceKey)))
				{
					context.LogError(string.Format(Messages.DialogResourceInvalid, Key), "DialogResourceInvalid", this);
				}
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateDialogKey(ValidationContext context)
		{
			if (Initial && string.IsNullOrEmpty(DialogKey))
			{
				context.LogError(string.Format(Messages.DialogKeyEmpty, Key), "DialogKeyEmpty", this);
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidatePath(ValidationContext context)
		{
			if (!string.IsNullOrEmpty(Path) && !pageExp.IsMatch(Path))
			{
				context.LogError(string.Format(Messages.DialogPathInvalid, Key), "DialogPathInvalid", this);
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateMobilePage(ValidationContext context)
		{
			if (!string.IsNullOrEmpty(MobilePage) && !pageExp.IsMatch(MobilePage))
			{
				context.LogError(string.Format(Messages.StateMobilePageInvalid, Key), "StateMobilePageInvalid", this);
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateMobileMasters(ValidationContext context)
		{
			if (!string.IsNullOrEmpty(MobileMasters))
			{
				foreach (string master in Regex.Split(MobileMasters, ","))
				{
					if (!masterExp.IsMatch(master))
					{
						context.LogError(string.Format(Messages.StateMobileMastersInvalid, Key), "StateMobileMastersInvalid", this);
						break;
					}
				}
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateDefaults(ValidationContext context)
		{
			if (!string.IsNullOrEmpty(Defaults) && !defaultsExp.IsMatch(Defaults))
			{
				context.LogError(string.Format(Messages.StateDefaultsInvalid, Key), "StateDefaultsInvalid", this);
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateDefaultTypes(ValidationContext context)
		{
			if (!string.IsNullOrEmpty(DefaultTypes) && !defaultTypesExp.IsMatch(DefaultTypes))
			{
				context.LogError(string.Format(Messages.StateDefaultTypesInvalid, Key), "StateDefaultTypesInvalid", this);
			}
		}

		[ValidationMethod(ValidationCategories.Open | ValidationCategories.Save | ValidationCategories.Menu)]
		private void ValidateNavigationNameUnique(ValidationContext context)
		{
			var q = from s in Successors
					where !string.IsNullOrEmpty(Transition.GetLink(this, s).Key)
					group Transition.GetLink(this, s) by Transition.GetLink(this, s).Key into g
					where g.Count() > 1
					select g;
			foreach (var d in q)
			{
				context.LogError(string.Format(Messages.DuplicateTransitionKey, Key, d.Key), "DuplicateTransitionKey", d.ToArray());
			}
		}
	}
}
