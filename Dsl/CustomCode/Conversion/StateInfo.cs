using System.Collections.Generic;
using System.Linq;

namespace Navigation.Designer
{
	public class StateInfo
	{
		List<State> _AssignedStates = new List<State>();
		List<Dialog> _Dialogs = new List<Dialog>();
		List<Transition> _RemovedTransitions = new List<Transition>();
		HashSet<State> _Initials = new HashSet<State>();

		private List<State> AssignedStates
		{
			get
			{
				return _AssignedStates;
			}
		}

		private List<Dialog> Dialogs
		{
			get
			{
				return _Dialogs;
			}
		}

		private List<Transition> RemovedTransitions
		{
			get
			{
				return _RemovedTransitions;
			}
		}

		private HashSet<State> Initials
		{
			get
			{
				return _Initials;
			}
			set
			{
				_Initials = value;
			}
		}

		private bool TransitionCreated
		{
			get;
			set;
		}

		public List<Dialog> Convert(NavigationDiagram navigationDiagram)
		{
			Initials = new HashSet<State>(navigationDiagram.States.Where(s => s.Initial));
			for (int i = 0; i < 3; i++)
				Run(navigationDiagram);
			return Dialogs;
		}

		private void Run(NavigationDiagram navigationDiagram)
		{
			AssignedStates.Clear();
			RemovedTransitions.Clear();
			Dialogs.Clear();
			AssignStates(navigationDiagram);
			List<Transition> removed = RemovedTransitions.ToList();
			TransitionCreated = true;
			while (TransitionCreated)
			{
				TransitionCreated = false;
				RestoreNavigations(navigationDiagram);
				RemovedTransitions.AddRange(removed);
			}
			CleanDialogs();
			CleanStates();
			Initials = new HashSet<State>(Dialogs.Select(d => d.Initial));
		}

		private void CreateNavigations(List<State> stateList)
		{
			bool canNavigateBack = false;
			foreach (State state in stateList)
			{
				var backPredecessors =
					from p in GetPredecessors(state, true)
					where Transition.GetLink(p, state).CanNavigateBack
					select p;
				canNavigateBack = backPredecessors.Count() > 0;
				CreateTransitions(backPredecessors, state);
				var notBackPredecessors =
					from p in GetPredecessors(state, true)
					where !Transition.GetLink(p, state).CanNavigateBack
					&& !Initials.Contains(state)
					select p;
				if (notBackPredecessors.Count() == 0)
				{
					if (!canNavigateBack || Initials.Contains(state))
						CreateDialog(state);
				}
				else
				{
					var dialogsContainingState =
						from d in GetDistinctDialogs(notBackPredecessors)
						where (from s in GetStateWrappers(state) select s.Parent).Contains(d)
						select d;
					if ((GetDistinctDialogs(notBackPredecessors).Count() - dialogsContainingState.Count() <= 1)
						&& GetDistinctDialogs(notBackPredecessors).Count() > 0)
						CreateTransitions(notBackPredecessors, state);
					else
						CreateDialog(state);
				}
				AssignedStates.Add(state);
			}
		}

		private IEnumerable<Dialog> GetDistinctDialogs(IEnumerable<State> states)
		{
			return (
				from s in states
				from sw in GetStateWrappers(s)
				group s by sw.Parent into ds
				select ds.Key
			).Distinct();
		}

		private void CreateDialog(State state)
		{
			if (Dialogs.Where(d => d.Initial == state).FirstOrDefault() == null)
				Dialogs.Add(new Dialog(state));
		}

		private void CreateTransitions(IEnumerable<State> predecessors, State state)
		{
			Transition transition;
			foreach (State predecessor in predecessors)
			{
				transition = Transition.GetLink(predecessor, state);
				foreach (StateWrapper sw in GetStateWrappers(predecessor).ToList())
					TransitionCreated = sw.AddTransition(transition.Key, state, transition.Order) || TransitionCreated;
			}
		}

		private IEnumerable<StateWrapper> GetStateWrappers(State state)
		{
			return (
				from d in Dialogs
				from s in d.States
				where s.State == state
				select s
			);
		}

		private IEnumerable<State> GetNextStates(NavigationDiagram navigationDiagram)
		{
			return from s in navigationDiagram.States
				   let c = (
					   from sp in GetPredecessors(s)
					   where !AssignedStates.Contains(sp)
					   select sp
				   ).Count()
				   where !AssignedStates.Contains(s)
				   && c == 0
				   select s;
		}

		private void RemoveNavigation(NavigationDiagram navigationDiagram)
		{
			var removableNavigations =
				from s in navigationDiagram.States
				let p = (
					from sp in GetPredecessors(s)
					where !AssignedStates.Contains(sp)
					select sp
				)
				where !AssignedStates.Contains(s)
				orderby Initials.Contains(s) descending, p.Count(), s.Predecessors.Count descending, s.Order
				select new { state = s, unassignedPredecessors = p };
			var navigation = removableNavigations.First();
			RemovedTransitions.Add(Transition.GetLink(navigation.unassignedPredecessors.First(), navigation.state));
		}

		private void RestoreNavigations(NavigationDiagram navigationDiagram)
		{
			foreach (Transition navigation in RemovedTransitions.Reverse<Transition>())
			{
				AssignedStates.Clear();
				AssignedStates.AddRange(navigationDiagram.States);
				AssignedStates.Remove(navigation.Successor);
				RemovedTransitions.Remove(navigation);
				AssignStates(navigationDiagram);
			}
			AssignedStates.Clear();
			AssignStates(navigationDiagram);
		}

		private void CleanDialogs()
		{
			bool remove = true;
			var cleanableDialogs =
				from d in Dialogs
				where d.Initial.Predecessors.Count > 0
				&& !d.Initial.Initial
				&& GetStateWrappers(d.Initial).Count() > 1
				select d;
			foreach (var dialog in cleanableDialogs.ToList())
			{
				remove = true;
				foreach (State predecessor in dialog.Initial.Predecessors)
				{
					foreach (StateWrapper s in GetStateWrappers(predecessor))
					{
						if (s.Parent != dialog)
							remove = remove && s.CanNavigateTo(dialog.Initial, null);
					}
				}
				if (remove)
					Dialogs.Remove(dialog);
			}
		}

		private void CleanStates()
		{
			var routedStates =
				from d in Dialogs
				from s in d.States
				where !string.IsNullOrEmpty(s.Route)
				group s by s.State into g
				select g;
			foreach (var r in routedStates)
			{
				bool clear = false;
				var routedState = from s in r
								  let initial = s.Parent.Initial == s.State
								  orderby initial descending, s.Parent.Order
								  select s;
				foreach (StateWrapper s in routedState)
				{
					if (clear)
						s.Route = string.Empty;
					clear = true;
				}
			}
		}

		private void AssignStates(NavigationDiagram navigationDiagram)
		{
			int assignedCount = 0;
			while (AssignedStates.Count != navigationDiagram.States.Count)
			{
				CreateNavigations(GetNextStates(navigationDiagram).ToList());
				if (assignedCount == AssignedStates.Count)
				{
					RemoveNavigation(navigationDiagram);
				}
				assignedCount = AssignedStates.Count;
			}
		}

		private IEnumerable<State> GetPredecessors(State state)
		{
			return GetPredecessors(state, false);
		}

		private IEnumerable<State> GetPredecessors(State state, bool includeSelf)
		{
			foreach (State predecessor in state.Predecessors)
			{
				if (!RemovedTransitions.Contains(Transition.GetLink(predecessor, state)))
				{
					if (includeSelf || predecessor != state)
						yield return predecessor;
				}
			}
		}
	}
}
