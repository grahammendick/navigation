using Navigation;
using Navigation.Glimpse.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Navigation.Glimpse.Support
{
	internal class Canvas
	{
		private const int Top = 25;
		private const int Left = 10;
		private const int Width = 750;
		private const int Height = 275;
		private const int StateWidth = 150;
		private const int StateHeight = 50;
		private const int StateSeparation = 40;
		private const int TransitionSeparation = 20;
		private const int TransitionStepHeight = 20;
		private const int FontSize = 15;
		private const int PaddingX = 10;
		private const int PaddingY = 5;

		internal static CanvasData Arrange(StateDisplayInfo stateDisplayInfo)
		{
			var transitionModels = new List<TransitionModel>();
			var stateModels = new List<StateModel>();
			var stateX = Left;
			var stateY = Top;
			var crumbs = StateController.Crumbs.Select((c, i) => new { Crumb = c, Index = i })
				.ToDictionary(c => c.Crumb.State, c => new { Crumb = c.Crumb, c.Index });
			foreach (Dialog dialog in StateInfoConfig.Dialogs)
			{
				stateX = Left;
				var depths = CalculateDepths(dialog, transitionModels);
				foreach (State state in dialog.States)
				{
					var stateModel = new StateModel(state);
					stateModels.Add(stateModel);
					stateModel.X = stateX;
					stateModel.Y = stateY;
					stateModel.H = StateHeight;
					stateModel.Page = state.Page;
					stateModel.Route = state.Route;
					stateModel.Theme = state.Theme;
					stateModel.Masters = state.Masters.ToList();
					if (state == StateContext.State)
					{
						stateModel.Current = state == StateContext.State;
						stateModel.Data = StateContext.Data;
						stateModel.Page = stateDisplayInfo.Page;
						stateModel.Route = stateDisplayInfo.Route;
						stateModel.Theme = stateDisplayInfo.Theme;
						stateModel.Masters = stateDisplayInfo.Masters;
					}
					stateModel.Previous = state == StateContext.PreviousState;
					stateModel.Back = 0;
					if (crumbs.ContainsKey(state))
					{
						stateModel.Back = crumbs.Count - crumbs[state].Index;
						stateModel.Data = crumbs[state].Crumb.Data;
					}
					if (stateModel.Data == null)
					{
						stateModel.Data = new NavigationData();
						foreach (string key in stateModel.State.Defaults.Keys)
							stateModel.Data[key] = stateModel.State.Defaults[key];
					}
					stateModel.W = ProcessTransitions(stateModel, transitionModels);
					stateX += stateModel.W + StateSeparation;
				}
				stateY += Top + StateHeight + depths.Count * TransitionStepHeight + FontSize;
			}
			var selected = stateModels.FirstOrDefault(s => s.Current) ?? new StateModel(new State());
			var selectedDialogTrans = transitionModels.Where(t => t.Transition.Parent.Parent == selected.State.Parent).DefaultIfEmpty();
			var lastState = stateModels.Last();
			return new CanvasData
			{
				States = stateModels,
				Transitions = transitionModels,
				X = Math.Min(0, Width - Math.Min(selected.X + selected.W + Left, selected.X + Width - Left)),
				Y = Math.Min(0, Height - Math.Min(Math.Max(selected.Y + selected.H, selectedDialogTrans.Max(t => t != null ? t.Y + t.H : 0)) + PaddingY + FontSize, selected.Y + Height - Top)),
				W = Math.Max(Width, stateModels.Max(s => s.X + s.W) + Left),
				H = Math.Max(Height, Math.Max(lastState.Y + lastState.H, transitionModels.DefaultIfEmpty().Max(t => t != null ? t.Y + t.H : 0)) + PaddingY + FontSize)
			};
		}

		private static Dictionary<int, HashSet<int>> CalculateDepths(Dialog dialog, List<TransitionModel> transModels)
		{
			var depths = new Dictionary<int, HashSet<int>>();
			var trans = from s in dialog.States
						from t in s.Transitions
						orderby Math.Abs(t.To.Index - t.Parent.Index)
						select new TransitionModel(t);
			foreach (var transitionModel in trans)
			{
				transModels.Add(transitionModel);
				CalculateDepth(depths, transitionModel);
			}
			return depths;
		}

		private static void CalculateDepth(Dictionary<int, HashSet<int>> depths, TransitionModel transModel)
		{
			var depthFound = false;
			var depth = 0;
			while (!depthFound)
			{
				depthFound = !depths.ContainsKey(depth) ||
					!depths[depth].Any(d => transModel.A <= d && d < transModel.B);
				if (!depthFound)
					depth++;
			}
			transModel.Depth = depth;
			if (!depths.ContainsKey(transModel.Depth))
				depths[transModel.Depth] = new HashSet<int>();
			depths[transModel.Depth].UnionWith(Enumerable.Range(transModel.A, transModel.B - transModel.A));
		}

		private static int ProcessTransitions(StateModel stateModel, List<TransitionModel> transModels)
		{
			var trans = TransByState(stateModel.State, transModels);
			var transWidth = (trans.Count() - 1) * TransitionSeparation;
			var width = StateWidth + Math.Max(0, transWidth + 2 * PaddingX - StateWidth);
			var start = stateModel.X + (width - transWidth) / 2;
			foreach (var transEl in trans)
			{
				transEl.Y = stateModel.Y + StateHeight;
				transEl.H = (transEl.Depth + 1) * TransitionStepHeight;
				transEl.SetCoords(stateModel.State, start);
				start += TransitionSeparation;
			}
			return width;
		}

		private static IEnumerable<TransitionModel> TransByState(State state, List<TransitionModel> transModels)
		{
			var q = from t in transModels
					let leftA = t.To == state && t.From.Index < t.To.Index
					let leftB = t.From == state && t.From.Index > t.To.Index
					let left = leftA || leftB
					let middle = t.From == state && t.To == state
					let right = !left && !middle
					where t.From == state || t.To == state
					select new { trans = t, left, right, middle };
			foreach (var t in q.Where(t => t.left).OrderBy(t => t.trans.Depth))
				yield return t.trans;
			foreach (var t in q.Where(t => t.middle).OrderByDescending(t => t.trans.Depth))
				yield return t.trans;
			foreach (var t in q.Where(t => t.middle).OrderBy(t => t.trans.Depth))
				yield return t.trans;
			foreach (var t in q.Where(t => t.right).OrderByDescending(t => t.trans.Depth))
				yield return t.trans;
		}
	}
}
