using System;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Xml;
using Navigation.Properties;

namespace Navigation
{
	/// <summary>
	/// Provides access to the Navigation/StateInfo section and is not intended to be used outside
	/// of the Navigation framework
	/// </summary>
	public sealed class StateInfoSectionHandler : IConfigurationSectionHandler
    {
        object IConfigurationSectionHandler.Create(Object parent, Object configContext, XmlNode section)
        {
            StateInfoCollection<Dialog> dialogs = new StateInfoCollection<Dialog>();
            Dialog dialog;
			int dialogIndex = 0;

            XmlNode dialogNode;
            int i;
            string dialogInitial;
            for (i = 0; i < section.ChildNodes.Count; i++)
            {
                dialog = new Dialog();

                dialogNode = section.ChildNodes[i];
                if (dialogNode.NodeType != XmlNodeType.Comment)
                {
					if (dialogNode.Attributes["initial"] == null || dialogNode.Attributes["initial"].Value.Length == 0)
						throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.DialogAttributeMissing, "initial"));
					dialogInitial = dialogNode.Attributes["initial"].Value;
                    dialog.Index = dialogIndex;
                    dialogIndex++;
					if (dialogNode.Attributes["key"] == null || dialogNode.Attributes["key"].Value.Length == 0)
						throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.DialogAttributeMissing, "key"));
                    dialog.Key = dialogNode.Attributes["key"].Value;
                    dialog.Title = dialogNode.Attributes["title"] != null ? dialogNode.Attributes["title"].Value : string.Empty;
                    dialog.ResourceType = dialogNode.Attributes["resourceType"] != null ? dialogNode.Attributes["resourceType"].Value : "StateInfo";
                    dialog.ResourceKey = dialogNode.Attributes["resourceKey"] != null ? dialogNode.Attributes["resourceKey"].Value : string.Empty;
                    dialog.Path = dialogNode.Attributes["path"] != null ? dialogNode.Attributes["path"].Value : string.Empty;
					if (dialogs[dialogNode.Attributes["key"].Value] != null)
						throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.DuplicateDialogKey, dialogNode.Attributes["key"].Value));
                    dialogs.Add(dialogNode.Attributes["key"].Value, dialog);

					ProcessStates(dialog, dialogNode);
					ProcessTransitions(dialog, dialogNode);
                    dialog.Initial = dialog.States[dialogInitial];
                    if (dialog.Initial == null)
						throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidDialogInitialKey, dialog.Key, dialogInitial));
                }
            }
            return dialogs;
        }

		private static void ProcessStates(Dialog dialog, XmlNode dialogNode)
		{
			State state;
			int stateIndex = 0;

			XmlNode dialogChildNode;
			string[] masters;
			int i;
			bool result;
			NavigationData defaults;
			for (i = 0; i < dialogNode.ChildNodes.Count; i++)
			{
				state = new State();
				dialogChildNode = dialogNode.ChildNodes[i];
				if (dialogChildNode.NodeType != XmlNodeType.Comment)
				{
					if (dialogChildNode.Name == "state")
					{
						state.Parent = dialog;
						state.Index = stateIndex;
						stateIndex++;
						if (dialogChildNode.Attributes["key"] == null || dialogChildNode.Attributes["key"].Value.Length == 0)
							throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeMissing, "key"));
						state.Key = dialogChildNode.Attributes["key"].Value;
						if (dialogChildNode.Attributes["page"] == null || dialogChildNode.Attributes["page"].Value.Length == 0)
							throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeMissing, "page"));
						state.Page = dialogChildNode.Attributes["page"].Value;
						state.MobilePage = dialogChildNode.Attributes["mobilePage"] != null ? dialogChildNode.Attributes["mobilePage"].Value : string.Empty;
						masters = new string[] { };
						if (dialogChildNode.Attributes["masters"] != null)
						{
							masters = Regex.Split(dialogChildNode.Attributes["masters"].Value, ",");
						}
						state.Masters = new ReadOnlyCollection<string>(masters);
						masters = new string[] { };
						if (dialogChildNode.Attributes["mobileMasters"] != null)
						{
							masters = Regex.Split(dialogChildNode.Attributes["mobileMasters"].Value, ",");
						}
						state.MobileMasters = new ReadOnlyCollection<string>(masters);
						state.Title = dialogChildNode.Attributes["title"] != null ? dialogChildNode.Attributes["title"].Value : string.Empty;
						state.Route = dialogChildNode.Attributes["route"] != null ? dialogChildNode.Attributes["route"].Value : string.Empty;
						state.MobileRoute = dialogChildNode.Attributes["mobileRoute"] != null ? dialogChildNode.Attributes["mobileRoute"].Value : string.Empty;
						state.Defaults = new StateInfoCollection<object>();
						state.FormattedDefaults = new StateInfoCollection<string>();
						if (dialogChildNode.Attributes["defaults"] != null)
						{
							try
							{
								defaults = NavigationDataExpressionBuilder.GetNavigationData(dialogChildNode.Attributes["defaults"].Value);
							}
							catch (InvalidOperationException ioe)
							{
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "defaults"), ioe);
							}
							catch (FormatException fe)
							{
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "defaults"), fe);
							}
							catch (OverflowException oe)
							{
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "defaults"), oe);
							}
							foreach (NavigationDataItem item in defaults)
							{
								state.Defaults[item.Key] = item.Value;
								state.FormattedDefaults[item.Key] = CrumbTrailManager.FormatURLObject(item.Value);
							}
						}
						state.TrackCrumbTrail = true;
						if (dialogChildNode.Attributes["trackCrumbTrail"] != null)
						{
							if (bool.TryParse(dialogChildNode.Attributes["trackCrumbTrail"].Value, out result))
								state.TrackCrumbTrail = result;
							else
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "trackCrumbTrail"));
						}
						state.CheckPhysicalUrlAccess = true;
						if (dialogChildNode.Attributes["checkPhysicalUrlAccess"] != null)
						{
							if (bool.TryParse(dialogChildNode.Attributes["checkPhysicalUrlAccess"].Value, out result))
								state.CheckPhysicalUrlAccess = result;
							else
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "checkPhysicalUrlAccess"));
						}
						state.ResourceType = dialogChildNode.Attributes["resourceType"] != null ? dialogChildNode.Attributes["resourceType"].Value : "StateInfo";
						state.ResourceKey = dialogChildNode.Attributes["resourceKey"] != null ? dialogChildNode.Attributes["resourceKey"].Value : string.Empty;
						state.Theme = dialogChildNode.Attributes["theme"] != null ? dialogChildNode.Attributes["theme"].Value : string.Empty;
						state.MobileTheme = dialogChildNode.Attributes["mobileTheme"] != null ? dialogChildNode.Attributes["mobileTheme"].Value : string.Empty;
						if (dialog.States[dialogChildNode.Attributes["key"].Value] != null)
							throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.DuplicateStateKey, dialogChildNode.Attributes["key"].Value, dialog.Key));
						dialog.States[dialogChildNode.Attributes["key"].Value] = state;
					}
				}
			}
		}

		private static void ProcessTransitions(Dialog dialog, XmlNode dialogNode)
		{
            State state;
            Transition transition;
			int transitionIndex = 0;

            XmlNode dialogChildNode, transitionNode;
            int i, j;
			for (i = 0; i < dialogNode.ChildNodes.Count; i++)
			{
				dialogChildNode = dialogNode.ChildNodes[i];
				if (dialogChildNode.NodeType != XmlNodeType.Comment)
				{
					if (dialogChildNode.Name == "state")
					{
						state = dialog.States[dialogChildNode.Attributes["key"].Value];
						transitionIndex = 0;
						for (j = 0; j < dialogChildNode.ChildNodes.Count; j++)
						{
							transitionNode = dialogChildNode.ChildNodes[j];
							if (transitionNode.NodeType != XmlNodeType.Comment)
							{
								transition = new Transition();
								transition.Parent = state;
								transition.Index = transitionIndex;
								transitionIndex++;
								if (transitionNode.Attributes["key"] == null || transitionNode.Attributes["key"].Value.Length == 0)
									throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.TransitionAttributeMissing, "key"));
								transition.Key = transitionNode.Attributes["key"].Value;
								if (transitionNode.Attributes["to"] == null || transitionNode.Attributes["to"].Value.Length == 0)
									throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.TransitionAttributeMissing, "to"));
								transition.To = dialog.States[transitionNode.Attributes["to"].Value];
								if (transition.To == null)
									throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidTransitionToKey, state.Key, transitionNode.Attributes["to"].Value));
								if (state.Transitions[transitionNode.Attributes["key"].Value] != null)
									throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.DuplicateTransitionKey, transitionNode.Attributes["key"].Value, state.Key));
								state.Transitions[transitionNode.Attributes["key"].Value] = transition;
							}
						}
					}
				}
			}
		}
    }
}
