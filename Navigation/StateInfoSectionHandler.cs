using Navigation.Properties;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Xml;

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
					dialog.Path = dialogNode.Attributes["path"] != null ? dialogNode.Attributes["path"].Value.Trim() : string.Empty;
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
			string[] masters, derived;
			int i;
			bool result;
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
						masters = new string[] { };
						state.Title = dialogChildNode.Attributes["title"] != null ? dialogChildNode.Attributes["title"].Value : string.Empty;
#if NET40Plus
						state.Route = dialogChildNode.Attributes["route"] != null ? dialogChildNode.Attributes["route"].Value : string.Empty;
#endif
						state.DefaultTypes = new StateInfoCollection<Type>();
						if (dialogChildNode.Attributes["defaultTypes"] != null)
						{
							if (!TryParseDefaultTypes(dialogChildNode.Attributes["defaultTypes"].Value, state))
							{
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "defaultTypes"));
							}
						}
						state.Defaults = new StateInfoCollection<object>();
						state.FormattedDefaults = new StateInfoCollection<string>();
						if (dialogChildNode.Attributes["defaults"] != null)
						{
							try
							{
								NavigationData navigationData = StateInfoConfig.ParseNavigationDataExpression(dialogChildNode.Attributes["defaults"].Value, state, false);
								foreach (NavigationDataItem item in navigationData)
								{
									state.Defaults[item.Key] = item.Value;
									state.FormattedDefaults[item.Key] = CrumbTrailManager.FormatURLObject(item.Key, item.Value, state);
								}
							}
							catch (InvalidCastException ice)
							{
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "defaults"), ice);
							}
							catch (FormatException fe)
							{
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "defaults"), fe);
							}
							catch (OverflowException oe)
							{
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "defaults"), oe);
							}
						}
						derived = new string[] { };
						state.DerivedInternal = new Dictionary<string, string>();
						if (dialogChildNode.Attributes["derived"] != null)
						{
							derived = Regex.Split(dialogChildNode.Attributes["derived"].Value, ",");
							for (int j = 0; j < derived.Length; j++)
							{
								derived[j] = derived[j].Trim();
								state.DerivedInternal.Add(derived[j], derived[j]);
							}
						}
						state.Derived = new ReadOnlyCollection<string>(derived);
						state.TrackCrumbTrail = true;
						if (dialogChildNode.Attributes["trackCrumbTrail"] != null)
						{
							if (bool.TryParse(dialogChildNode.Attributes["trackCrumbTrail"].Value, out result))
								state.TrackCrumbTrail = result;
							else
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.StateAttributeInvalid, state.Key, "trackCrumbTrail"));
						}
						state.ResourceType = dialogChildNode.Attributes["resourceType"] != null ? dialogChildNode.Attributes["resourceType"].Value : "StateInfo";
						state.ResourceKey = dialogChildNode.Attributes["resourceKey"] != null ? dialogChildNode.Attributes["resourceKey"].Value : string.Empty;
						if (dialog.States[dialogChildNode.Attributes["key"].Value] != null)
							throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.DuplicateStateKey, dialogChildNode.Attributes["key"].Value, dialog.Key));
						state.Attributes = new StateInfoCollection<string>();
						foreach (XmlAttribute attribute in dialogChildNode.Attributes)
							state.Attributes[attribute.Name] = attribute.Value;
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

		private static bool TryParseDefaultTypes(string expression, State state)
		{
			string[] keyTypeValue;
			string key, type;
			foreach (string dataItem in expression.Split(new char[] { ',' }))
			{
				keyTypeValue = dataItem.Split(new char[] { '=' });
				if (keyTypeValue.Length != 2)
					return false;
				type = keyTypeValue[1].Trim().ToUpperInvariant();
				key = keyTypeValue[0].Trim();
				if (StateInfoConfig.GetType(type) == null)
					return false;
				state.DefaultTypes[key] = StateInfoConfig.GetType(type);
			}
			return true;
		}
	}
}
