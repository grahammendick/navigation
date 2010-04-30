using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Configuration;

namespace Navigation.Test
{
	[TestClass]
	public class StateInfoTest
	{
		public StateInfoTest()
		{
		}

		private TestContext testContextInstance;

		public TestContext TestContext
		{
			get
			{
				return testContextInstance;
			}
			set
			{
				testContextInstance = value;
			}
		}

		[TestMethod]
		public void InitialTest()
		{
			Assert.IsNull(StateContext.State);
			Assert.IsNull(StateContext.Dialog);
			Assert.IsNull(StateContext.PreviousState);
			Assert.IsNull(StateContext.PreviousDialog);
		}

		[TestMethod]
		public void DialogTest()
		{
			Assert.AreEqual(2, StateInfoConfig.Dialogs.Count);
			int i = 0;
			foreach (Dialog dialog in StateInfoConfig.Dialogs)
			{
				Assert.AreEqual("d" + i, dialog.Key);
				Assert.AreEqual(dialog.Key, dialog.Title);
				Assert.AreEqual(i, dialog.Index);
				Assert.AreEqual("s0", dialog.Initial.Title);
				i++;
			}
		}

		[TestMethod]
		public void StateTest()
		{
			string page = "~/{0}/{1}.aspx";
			int i = 0;
			foreach (Dialog dialog in StateInfoConfig.Dialogs)
			{
				Assert.AreEqual(5 + dialog.Index, dialog.States.Count);
				i = 0;
				foreach (State state in StateInfoConfig.Dialogs[dialog.Key].States)
				{
					Assert.AreEqual("s" + i, state.Key);
					Assert.AreEqual(state.Key, state.Title);
					Assert.AreEqual(i, state.Index);
					Assert.AreEqual(string.Format(page, dialog.Key, state.Key), state.Page);
					i++;
				}
			}
		}

		[TestMethod]
		public void TransitionTest()
		{
			int i = 0;
			foreach (Dialog dialog in StateInfoConfig.Dialogs)
			{
				foreach (State state in StateInfoConfig.Dialogs[dialog.Key].States)
				{
					i = 0;
					if (dialog.Index == 0)
						Assert.AreEqual(4 - state.Index, state.Transitions.Count);
					if (dialog.Index == 1)
						if (state.Index != 5)
							Assert.AreEqual(1, state.Transitions.Count);
						else
							Assert.AreEqual(5, state.Transitions.Count);
					foreach (Transition transition in dialog.States[state.Key].Transitions)
					{
						Assert.AreEqual("t" + i, transition.Key);
						Assert.AreEqual(i, transition.Index);
						i++;
					}
				}
			}
		}

		[TestMethod]
		public void DialogInitialTest()
		{
			foreach (Dialog dialog in StateInfoConfig.Dialogs)
			{
				Assert.AreEqual(dialog.States[0], dialog.Initial);
			}
		}

		[TestMethod]
		public void StateParentTest()
		{
			foreach (Dialog dialog in (IEnumerable<Dialog>) StateInfoConfig.Dialogs)
			{
				foreach (State state in StateInfoConfig.Dialogs[dialog.Index].States)
				{
					Assert.AreEqual(dialog, state.Parent);
				}
			}
		}

		[TestMethod]
		public void TransitionParentTest()
		{
			foreach (Dialog dialog in StateInfoConfig.Dialogs)
			{
				foreach (State state in StateInfoConfig.Dialogs[dialog.Index].States)
				{
					foreach (Transition transition in StateInfoConfig.Dialogs[dialog.Index].States[state.Key].Transitions)
					{
						Assert.AreEqual(state, transition.Parent);
					}
				}
			}
		}

		[TestMethod]
		public void TransitionToTest()
		{
			foreach (Dialog dialog in StateInfoConfig.Dialogs)
			{
				foreach (State state in dialog.States)
				{
					foreach (Transition transition in state.Transitions)
					{
						Assert.AreEqual(dialog.States[transition.To.Key], transition.To);
					}
				}
			}
		}

		[TestMethod]
		public void MasterThemeTest()
		{
			Assert.AreEqual(string.Empty, StateInfoConfig.Dialogs[0].States[0].Theme);
			Assert.AreEqual(0, StateInfoConfig.Dialogs[0].States[0].Masters.Count);
			Assert.AreEqual("test", StateInfoConfig.Dialogs[1].States[0].Theme);
			Assert.AreEqual("test1", StateInfoConfig.Dialogs[1].States[0].Masters[0]);
			Assert.AreEqual("test2", StateInfoConfig.Dialogs[1].States[0].Masters[1]);
			Assert.AreEqual("", StateInfoConfig.Dialogs[1].States[1].Masters[0]);
			Assert.AreEqual("", StateInfoConfig.Dialogs[1].States[1].Masters[1]);
			Assert.AreEqual("!@", StateInfoConfig.Dialogs[1].States[2].Masters[0]);
		}

		[TestMethod]
		public void StateInfoCopyTo()
		{
			Dialog[] dialogArr = new Dialog[2];
			State[] stateArr = new State[5];
			Transition[] transitionArr = new Transition[5];
			StateInfoConfig.Dialogs.CopyTo(dialogArr, 0);
			StateInfoConfig.Dialogs[0].States.CopyTo(stateArr, 0);
			StateInfoConfig.Dialogs[0].States[0].Transitions.CopyTo(transitionArr, 1);
			Assert.AreEqual(dialogArr[0], StateInfoConfig.Dialogs[0]);
			Assert.AreEqual(dialogArr[1], StateInfoConfig.Dialogs[1]);
			Assert.AreEqual(stateArr[0], StateInfoConfig.Dialogs[0].States[0]);
			Assert.AreEqual(stateArr[1], StateInfoConfig.Dialogs[0].States[1]);
			Assert.AreEqual(stateArr[2], StateInfoConfig.Dialogs[0].States[2]);
			Assert.AreEqual(stateArr[3], StateInfoConfig.Dialogs[0].States[3]);
			Assert.AreEqual(stateArr[4], StateInfoConfig.Dialogs[0].States[4]);
			Assert.AreEqual(transitionArr[1], StateInfoConfig.Dialogs[0].States[0].Transitions[0]);
			Assert.AreEqual(transitionArr[2], StateInfoConfig.Dialogs[0].States[0].Transitions[1]);
			Assert.AreEqual(transitionArr[3], StateInfoConfig.Dialogs[0].States[0].Transitions[2]);
			Assert.AreEqual(transitionArr[4], StateInfoConfig.Dialogs[0].States[0].Transitions[3]);
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidTransitionToTest()
		{
			ConfigurationManager.GetSection("Navigation/InvalidTransitionTo");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidInitialTest()
		{
			ConfigurationManager.GetSection("Navigation/InvalidInitial");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void DuplicateDialogTest()
		{
			ConfigurationManager.GetSection("Navigation/DuplicateDialog");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void DuplicateStateTest()
		{
			ConfigurationManager.GetSection("Navigation/DuplicateState");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void DuplicateTransitionTest()
		{
			ConfigurationManager.GetSection("Navigation/DuplicateTransition");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void MissingDialogKeyTest()
		{
			ConfigurationManager.GetSection("Navigation/MissingDialogKey");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void EmptyDialogKeyTest()
		{
			ConfigurationManager.GetSection("Navigation/EmptyDialogKey");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void MissingDialogInitialTest()
		{
			ConfigurationManager.GetSection("Navigation/MissingDialogInitial");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void EmptyDialogInitialTest()
		{
			ConfigurationManager.GetSection("Navigation/EmptyDialogInitial");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void MissingStateKeyTest()
		{
			ConfigurationManager.GetSection("Navigation/MissingStateKey");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void EmptyStateKeyTest()
		{
			ConfigurationManager.GetSection("Navigation/EmptyStateKey");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void MissingStatePageTest()
		{
			ConfigurationManager.GetSection("Navigation/MissingStatePage");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void EmptyStatePageTest()
		{
			ConfigurationManager.GetSection("Navigation/EmptyStatePage");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void MissingTransitionKeyTest()
		{
			ConfigurationManager.GetSection("Navigation/MissingTransitionKey");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void EmptyTransitionKeyTest()
		{
			ConfigurationManager.GetSection("Navigation/EmptyTransitionKey");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void MissingTransitionToTest()
		{
			ConfigurationManager.GetSection("Navigation/MissingTransitionTo");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void EmptyTransitionToTest()
		{
			ConfigurationManager.GetSection("Navigation/EmptyTransitionTo");
		}
	}
}
