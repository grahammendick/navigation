using Glimpse.Core.Extensibility;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Navigation;
using Navigation.Glimpse.Model;
using Navigation.Glimpse.Support;
using Navigation.Glimpse.Tab;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Navigation.Glimpse.Test
{
	[TestClass]
	public class NavigationTabTest
	{
		private static IEnumerable<StateModel> StateModels
		{
			get;
			set;
		}

		private static IEnumerable<TransitionModel> TransitionModels
		{
			get;
			set;
		}

		private static CanvasData CanvasData
		{
			get
			{
				var context = new Mock<ITabContext> { DefaultValue = DefaultValue.Mock };
				var httpBaseMock = new Mock<HttpContextBase>();
				context.Setup(c => c.GetRequestContext<HttpContextBase>()).Returns(httpBaseMock.Object);
				httpBaseMock.Setup(c => c.Request["n0"]).Returns("");
				return (CanvasData)new NavigationTab().GetData(context.Object);
			}
		}

		[ClassInitialize]
		public static void Initialize(TestContext testContext)
		{
			StateController.Navigate("D1");
			var canvasData = CanvasData;
			StateModels = canvasData.States;
			TransitionModels = canvasData.Transitions;
		}

		private static StateModel GetState(IEnumerable<StateModel> stateModels, string statePath)
		{
			var keys = statePath.Split('.');
			return (stateModels ?? StateModels).Where(s => s.State.Key == keys[1]
				&& s.State.Parent.Key == keys[0]).First();
		}

		private static TransitionModel GetTransition(string transitionPath)
		{
			var keys = transitionPath.Split('.');
			return TransitionModels.Where(t => t.Transition.Key == keys[2]
				&& t.Transition.Parent.Key == keys[1]
				&& t.Transition.Parent.Parent.Key == keys[0]).First();
		}

		[TestMethod]
		public void ReturnAllStatesTest()
		{
			var q = from d in StateInfoConfig.Dialogs
					from s in d.States
					select s;
			Assert.AreEqual(q.Count(), StateModels.Count());
		}

		[TestMethod]
		public void ReturnAllTransitionsTest()
		{
			var q = from d in StateInfoConfig.Dialogs
					from s in d.States
					from t in s.Transitions
					select t;
			Assert.AreEqual(q.Count(), TransitionModels.Count());
		}

		[TestMethod]
		public void SetXTo10ForDialog1State1Test()
		{
			Assert.AreEqual(10, GetState(null, "D1.S1").X);
		}

		[TestMethod]
		public void SetXTo200ForDialog1State2Test()
		{
			Assert.AreEqual(200, GetState(null, "D1.S2").X);
		}

		[TestMethod]
		public void SetXTo390ForDialog1State3Test()
		{
			Assert.AreEqual(390, GetState(null, "D1.S3").X);
		}

		[TestMethod]
		public void SetYTo25ForAllDialog1StatesTest()
		{
			var states = StateModels.Where(s => s.State.Parent.Key == "D1" && s.Y != 25);
			Assert.AreEqual(0, states.Count());
		}

		[TestMethod]
		public void SetWTo150ForAllDialog1StatesTest()
		{
			var states = StateModels.Where(s => s.State.Parent.Key == "D1" && s.W != 150);
			Assert.AreEqual(0, states.Count());
		}

		[TestMethod]
		public void SetHTo50ForAllDialog1StatesTest()
		{
			var states = StateModels.Where(s => s.State.Parent.Key == "D1" && s.H != 50);
			Assert.AreEqual(0, states.Count());
		}

		[TestMethod]
		public void SetX1To85ForSingleTransitionFromDialog1State1Test()
		{
			Assert.AreEqual(85, GetTransition("D1.S1.T1").X1);
		}

		[TestMethod]
		public void SetX2To275ForSingleTransitionToDialog1State2Test()
		{
			Assert.AreEqual(275, GetTransition("D1.S1.T1").X2);
		}

		[TestMethod]
		public void SetX1To455ForSingleSelfTransitionFromDialog1State3Test()
		{
			Assert.AreEqual(455, GetTransition("D1.S3.T1").X1);
		}

		[TestMethod]
		public void SetX2To475ForSingleSelfTransitionToDialog1State3Test()
		{
			Assert.AreEqual(475, GetTransition("D1.S3.T1").X2);
		}

		[TestMethod]
		public void SetX1To845ForSingleBackTransitionFromDialog1State5Test()
		{
			Assert.AreEqual(845, GetTransition("D1.S5.T1").X1);
		}

		[TestMethod]
		public void SetX2To655ForSingleBackTransitionToDialog1State4Test()
		{
			Assert.AreEqual(655, GetTransition("D1.S5.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForAllDialog1TransitionsTest()
		{
			var trans = TransitionModels.Where(t => t.Transition.Parent.Parent.Key == "D1" && t.H != 20);
			Assert.AreEqual(0, trans.Count());
		}

		[TestMethod]
		public void SetYTo75ForAllDialog1TransitionsTest()
		{
			var trans = TransitionModels.Where(t => t.Transition.Parent.Parent.Key == "D1" && t.Y != 75);
			Assert.AreEqual(0, trans.Count());
		}

		[TestMethod]
		public void SetXTo10ForDialog2State1Test()
		{
			Assert.AreEqual(10, GetState(null, "D2.S1").X);
		}

		[TestMethod]
		public void SetXTo200ForDialog2State2Test()
		{
			Assert.AreEqual(200, GetState(null, "D2.S2").X);
		}

		[TestMethod]
		public void SetYTo135ForAllDialog2StatesTest()
		{
			var states = StateModels.Where(s => s.State.Parent.Key == "D2" && s.Y != 135);
			Assert.AreEqual(0, states.Count());
		}

		[TestMethod]
		public void SetX1To95ForDoubleTransition1FromDialog2State1Test()
		{
			Assert.AreEqual(95, GetTransition("D2.S1.T1").X1);
		}

		[TestMethod]
		public void SetX2To265ForDoubleTransition1ToDialog2State2Test()
		{
			Assert.AreEqual(265, GetTransition("D2.S1.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleTransition2FromDialog2State1Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S1.T1").H);
		}

		[TestMethod]
		public void SetX1To75ForDoubleTransition2FromDialog2State1Test()
		{
			Assert.AreEqual(75, GetTransition("D2.S1.T2").X1);
		}

		[TestMethod]
		public void SetX2To285ForDoubleTransition2ToDialog2State2Test()
		{
			Assert.AreEqual(285, GetTransition("D2.S1.T2").X2);
		}

		[TestMethod]
		public void SetHTo40ForDoubleTransition2FromDialog2State1Test()
		{
			Assert.AreEqual(40, GetTransition("D2.S1.T2").H);
		}

		[TestMethod]
		public void SetX1To455ForDoubleSelfTransition1FromDialog2State3Test()
		{
			Assert.AreEqual(455, GetTransition("D2.S3.T1").X1);
		}

		[TestMethod]
		public void SetX2To475ForDoubleSelfTransition1ToDialog2State3Test()
		{
			Assert.AreEqual(475, GetTransition("D2.S3.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleSelfTransition1FromDialog2State3Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S3.T1").H);
		}

		[TestMethod]
		public void SetX1To435ForDoubleSelfTransition2FromDialog2State3Test()
		{
			Assert.AreEqual(435, GetTransition("D2.S3.T2").X1);
		}

		[TestMethod]
		public void SetX2To495ForDoubleSelfTransition2ToDialog2State3Test()
		{
			Assert.AreEqual(495, GetTransition("D2.S3.T2").X2);
		}

		[TestMethod]
		public void SetHTo40ForDoubleSelfTransition2FromDialog2State3Test()
		{
			Assert.AreEqual(40, GetTransition("D2.S3.T2").H);
		}

		[TestMethod]
		public void SetX1To835ForDoubleBackTransition1FromDialog2State5Test()
		{
			Assert.AreEqual(835, GetTransition("D2.S5.T1").X1);
		}

		[TestMethod]
		public void SetX2To665ForDoubleBackTransition1ToDialog2State4Test()
		{
			Assert.AreEqual(665, GetTransition("D2.S5.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleBackTransition1FromDialog2State5Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S5.T1").H);
		}

		[TestMethod]
		public void SetX1To855ForDoubleBackTransition2FromDialog2State5Test()
		{
			Assert.AreEqual(855, GetTransition("D2.S5.T2").X1);
		}

		[TestMethod]
		public void SetX2To645ForDoubleBackTransition2ToDialog2State4Test()
		{
			Assert.AreEqual(645, GetTransition("D2.S5.T2").X2);
		}

		[TestMethod]
		public void SetHTo40ForDoubleBackTransition2FromDialog2State5Test()
		{
			Assert.AreEqual(40, GetTransition("D2.S5.T2").H);
		}

		[TestMethod]
		public void SetX1To1045ForDoubleFromAndToTransition1FromDialog2State6Test()
		{
			Assert.AreEqual(1045, GetTransition("D2.S6.T1").X1);
		}

		[TestMethod]
		public void SetX2To1215ForDoubleFromAndToTransition1ToDialog2State7Test()
		{
			Assert.AreEqual(1215, GetTransition("D2.S6.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleFromAndToTransition1FromDialog2State6Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S6.T1").H);
		}

		[TestMethod]
		public void SetX1To1235ForDoubleFromAndToTransition1FromDialog2State7Test()
		{
			Assert.AreEqual(1235, GetTransition("D2.S7.T1").X1);
		}

		[TestMethod]
		public void SetX2To1025ForDoubleFromAndToTransition1ToDialog2State6Test()
		{
			Assert.AreEqual(1025, GetTransition("D2.S7.T1").X2);
		}

		[TestMethod]
		public void SetHTo40ForDoubleFromAndToTransition1FromDialog2State7Test()
		{
			Assert.AreEqual(40, GetTransition("D2.S7.T1").H);
		}

		[TestMethod]
		public void SetX1To1395ForDoubleSelfAndSelfTransition1FromDialog2State8Test()
		{
			Assert.AreEqual(1395, GetTransition("D2.S8.T1").X1);
		}

		[TestMethod]
		public void SetX2To1415ForDoubleSelfAndFromTransition1ToDialog2State8Test()
		{
			Assert.AreEqual(1415, GetTransition("D2.S8.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleSelfAndFromTransition1FromDialog2State8Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S8.T1").H);
		}

		[TestMethod]
		public void SetX1To1435ForDoubleSelfAndFromTransition2FromDialog2State8Test()
		{
			Assert.AreEqual(1435, GetTransition("D2.S8.T2").X1);
		}

		[TestMethod]
		public void SetX2To1605ForDoubleSelfAndFromTransition2ToDialog2State9Test()
		{
			Assert.AreEqual(1605, GetTransition("D2.S8.T2").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleSelfAndFromTransition2FromDialog2State8Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S8.T2").H);
		}

		[TestMethod]
		public void SetX1To1815ForDoubleFromAndSelfTransition1FromDialog2State10Test()
		{
			Assert.AreEqual(1815, GetTransition("D2.S10.T1").X1);
		}

		[TestMethod]
		public void SetX2To1985ForDoubleFromAndSelfTransition1ToDialog2State11Test()
		{
			Assert.AreEqual(1985, GetTransition("D2.S10.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleFromAndSelfTransition1FromDialog2State10Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S10.T1").H);
		}

		[TestMethod]
		public void SetX1To1775ForDoubleFromAndSelfTransition2FromDialog2State10Test()
		{
			Assert.AreEqual(1775, GetTransition("D2.S10.T2").X1);
		}

		[TestMethod]
		public void SetX2To1795ForDoubleFromAndSelfTransition2ToDialog2State10Test()
		{
			Assert.AreEqual(1795, GetTransition("D2.S10.T2").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleFromAndSelfTransition2FromDialog2State10Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S10.T2").H);
		}

		[TestMethod]
		public void SetX1To2155ForDoubleSelfAndBackTransition1FromDialog2State12Test()
		{
			Assert.AreEqual(2155, GetTransition("D2.S12.T1").X1);
		}

		[TestMethod]
		public void SetX2To2175ForDoubleSelfAndBackTransition1ToDialog2State12Test()
		{
			Assert.AreEqual(2175, GetTransition("D2.S12.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleSelfAndBackTransition1FromDialog2State12Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S12.T1").H);
		}

		[TestMethod]
		public void SetX1To2365ForDoubleSelfAndBackTransition2FromDialog2State13Test()
		{
			Assert.AreEqual(2365, GetTransition("D2.S13.T1").X1);
		}

		[TestMethod]
		public void SetX2To2195ForDoubleSelfAndBackTransition2ToDialog2State12Test()
		{
			Assert.AreEqual(2195, GetTransition("D2.S13.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForDoubleSelfAndBackTransition2FromDialog2State13Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S13.T1").H);
		}

		[TestMethod]
		public void SetX1To2555ForCrossingTransition1FromDialog2State14Test()
		{
			Assert.AreEqual(2555, GetTransition("D2.S14.T1").X1);
		}

		[TestMethod]
		public void SetX2To2935ForCrossingTransition1ToDialog2State16Test()
		{
			Assert.AreEqual(2935, GetTransition("D2.S14.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForCrossingTransition1FromDialog2State14Test()
		{
			Assert.AreEqual(20, GetTransition("D2.S14.T1").H);
		}

		[TestMethod]
		public void SetX1To2745ForCrossingTransition2FromDialog2State15Test()
		{
			Assert.AreEqual(2745, GetTransition("D2.S15.T1").X1);
		}

		[TestMethod]
		public void SetX2To3125ForCrossingTransition2ToDialog2State17Test()
		{
			Assert.AreEqual(3125, GetTransition("D2.S15.T1").X2);
		}

		[TestMethod]
		public void SetHTo40ForCrossingTransition2FromDialog2State15Test()
		{
			Assert.AreEqual(40, GetTransition("D2.S15.T1").H);
		}

		[TestMethod]
		public void SetYTo185ForAllDialog2TransitionsTest()
		{
			var trans = TransitionModels.Where(t => t.Transition.Parent.Parent.Key == "D2" && t.Y != 185);
			Assert.AreEqual(0, trans.Count());
		}

		[TestMethod]
		public void SetYTo265ForAllDialog3StatesTest()
		{
			var states = StateModels.Where(s => s.State.Parent.Key == "D3" && s.Y != 265);
			Assert.AreEqual(0, states.Count());
		}

		[TestMethod]
		public void SetX1To85ForTransition1OfS1S2_S2S2_S3S2Test()
		{
			Assert.AreEqual(85, GetTransition("D3.S1.T1").X1);
		}

		[TestMethod]
		public void SetX2To245ForTransition1OfS1S2_S2S2_S3S2Test()
		{
			Assert.AreEqual(245, GetTransition("D3.S1.T1").X2);
		}

		[TestMethod]
		public void SetX1To265ForTransition2OfS1S2_S2S2_S3S2Test()
		{
			Assert.AreEqual(265, GetTransition("D3.S2.T1").X1);
		}

		[TestMethod]
		public void SetX2To285ForTransition2OfS1S2_S2S2_S3S2Test()
		{
			Assert.AreEqual(285, GetTransition("D3.S2.T1").X2);
		}

		[TestMethod]
		public void SetX1To465ForTransition3OfS1S2_S2S2_S3S2Test()
		{
			Assert.AreEqual(465, GetTransition("D3.S3.T1").X1);
		}

		[TestMethod]
		public void SetX2To305ForTransition3OfS1S2_S2S2_S3S2Test()
		{
			Assert.AreEqual(305, GetTransition("D3.S3.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForAllTransitionsOfS1S2_S2S2_S3S2Test()
		{
			var trans = TransitionModels.Where(t => t.Transition.Parent.Parent.Key == "D3" && t.H != 20);
			Assert.AreEqual(0, trans.Count());
		}

		[TestMethod]
		public void SetX1To75ForTransition1OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(75, GetTransition("D4.S1.T1").X1);
		}

		[TestMethod]
		public void SetX2To475ForTransition1OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(475, GetTransition("D4.S1.T1").X2);
		}

		[TestMethod]
		public void SetHTo40ForTransition1OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(40, GetTransition("D4.S1.T1").H);
		}

		[TestMethod]
		public void SetX1To265ForTransition2OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(265, GetTransition("D4.S2.T1").X1);
		}

		[TestMethod]
		public void SetX2To95ForTransition2OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(95, GetTransition("D4.S2.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForTransition2OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(20, GetTransition("D4.S2.T1").H);
		}

		[TestMethod]
		public void SetX1To285ForTransition3OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(285, GetTransition("D4.S2.T2").X1);
		}

		[TestMethod]
		public void SetX2To455ForTransition3OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(455, GetTransition("D4.S2.T2").X2);
		}

		[TestMethod]
		public void SetHTo20ForTransition3OfS1S3_S2S1_S2S3Test()
		{
			Assert.AreEqual(20, GetTransition("D4.S2.T2").H);
		}

		[TestMethod]
		public void SetX1To105ForTransition1OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(105, GetTransition("D5.S1.T1").X1);
		}

		[TestMethod]
		public void SetX2To445ForTransition1OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(445, GetTransition("D5.S1.T1").X2);
		}

		[TestMethod]
		public void SetHTo20ForTransition1OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(20, GetTransition("D5.S1.T1").H);
		}

		[TestMethod]
		public void SetX1To465ForTransition2OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(465, GetTransition("D5.S3.T1").X1);
		}

		[TestMethod]
		public void SetX2To85ForTransition2OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(85, GetTransition("D5.S3.T1").X2);
		}

		[TestMethod]
		public void SetHTo40ForTransition2OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(40, GetTransition("D5.S3.T1").H);
		}

		[TestMethod]
		public void SetX1To485ForTransition3OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(485, GetTransition("D5.S3.T2").X1);
		}

		[TestMethod]
		public void SetX2To65ForTransition3OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(65, GetTransition("D5.S3.T2").X2);
		}

		[TestMethod]
		public void SetHTo60ForTransition3OfS1S3_S3S1_S3S1Test()
		{
			Assert.AreEqual(60, GetTransition("D5.S3.T2").H);
		}

		[TestMethod]
		public void WidenStateWTo160For4SelfTransitionsTest()
		{
			Assert.AreEqual(160, GetState(null, "D6.S1").W);
		}

		[TestMethod]
		public void WidenStateWTo200For9TransitionsTest()
		{
			Assert.AreEqual(200, GetState(null, "D7.S1").W);
		}

		[TestMethod]
		public void SetStatePageTest()
		{
			Assert.AreEqual("~/P1.aspx", GetState(null, "D1.S1").Page);
		}

		[TestMethod]
		public void SetStateMastersTest()
		{
			Assert.AreEqual("~/M2.master", GetState(null, "D1.S2").Masters[0]);
		}

		[TestMethod]
		public void SetStateRouteTest()
		{
			Assert.AreEqual("R3", GetState(null, "D1.S3").Route);
		}

		[TestMethod]
		public void SetStateThemeTest()
		{
			Assert.AreEqual("T4", GetState(null, "D1.S4").Theme);
		}

		[TestMethod]
		public void SetStateTest()
		{
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[0], GetState(null, "D1.S1").State);
		}

		[TestMethod]
		public void SetTransitionTest()
		{
			Assert.AreEqual(StateInfoConfig.Dialogs[0].States[0].Transitions[0], GetTransition("D1.S1.T1").Transition);
		}

		[TestMethod]
		public void SetBackForCrumbsTest()
		{
			StateController.Navigate("D8");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			var states = CanvasData.States;
			Assert.AreEqual(3, GetState(states, "D8.S1").Back);
			Assert.AreEqual(2, GetState(states, "D8.S2").Back);
			Assert.AreEqual(1, GetState(states, "D8.S3").Back);
			Assert.AreEqual(0, GetState(states, "D8.S4").Back);
		}

		[TestMethod]
		public void SetPreviousStateTest()
		{
			StateController.Navigate("D8");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			var states = CanvasData.States;
			Assert.IsTrue(GetState(states, "D8.S3").Previous);
			Assert.IsFalse(GetState(states, "D8.S4").Previous);
		}

		[TestMethod]
		public void SetCurrentStateTest()
		{
			StateController.Navigate("D8");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			var states = CanvasData.States;
			Assert.IsFalse(GetState(states, "D8.S3").Current);
			Assert.IsTrue(GetState(states, "D8.S4").Current);
		}

		[TestMethod]
		public void SetCrumbDataTest()
		{
			StateController.Navigate("D8", new NavigationData { { "s", "x" } });
			StateController.Navigate("T1", new NavigationData { { "n", 1 } });
			StateController.Navigate("T1", new NavigationData { { "s", "y" }, { "n", 2 } });
			StateController.Navigate("T1");
			var states = CanvasData.States;
			Assert.AreEqual("x", GetState(states, "D8.S1").Data["s"]);
			Assert.IsNull(GetState(states, "D8.S1").Data["n"]);
			Assert.IsNull(GetState(states, "D8.S2").Data["s"]);
			Assert.AreEqual(1, GetState(states, "D8.S2").Data["n"]);
			Assert.AreEqual("y", GetState(states, "D8.S3").Data["s"]);
			Assert.AreEqual(2, GetState(states, "D8.S3").Data["n"]);
		}

		[TestMethod]
		public void SetCurrentDataTest()
		{
			StateController.Navigate("D8");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1", new NavigationData { { "s", "z" }, { "n", 3 } });
			var states = CanvasData.States;
			Assert.AreEqual("z", GetState(states, "D8.S4").Data["s"]);
			Assert.AreEqual(3, GetState(states, "D8.S4").Data["n"]);
		}

		[TestMethod]
		public void SetDefaultDataTest()
		{
			StateController.Navigate("D8");
			var states = CanvasData.States;
			Assert.AreEqual("a", GetState(states, "D8.S4").Data["s"]);
			Assert.AreEqual(4, GetState(states, "D8.S4").Data["n"]);
		}

		[TestMethod]
		public void SetWTo3210Test()
		{
			Assert.AreEqual(3210, CanvasData.W);
		}

		[TestMethod]
		public void SetHTo1585Test()
		{
			Assert.AreEqual(1585, CanvasData.H);
		}

		[TestMethod]
		public void SetXTo0ForD1Test()
		{
			StateController.Navigate("D1");
			Assert.AreEqual(0, CanvasData.X);
		}

		[TestMethod]
		public void SetYTo0ForD1Test()
		{
			StateController.Navigate("D1");
			Assert.AreEqual(0, CanvasData.Y);
		}

		[TestMethod]
		public void SetXTo0ForD3Test()
		{
			StateController.Navigate("D3");
			Assert.AreEqual(0, CanvasData.X);
		}

		[TestMethod]
		public void SetYToNeg80ForD3Test()
		{
			StateController.Navigate("D3");
			Assert.AreEqual(-80, CanvasData.Y);
		}

		[TestMethod]
		public void SetYToNeg800ForD7Test()
		{
			StateController.Navigate("D7");
			Assert.AreEqual(-800, CanvasData.Y);
		}

		[TestMethod]
		public void SetXToNeg180ForD8S5Test()
		{
			StateController.Navigate("D8");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			Assert.AreEqual(-180, CanvasData.X);
		}

		[TestMethod]
		public void SetXToNeg950ForD8S6Test()
		{
			StateController.Navigate("D8");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			StateController.Navigate("T1");
			Assert.AreEqual(-950, CanvasData.X);
		}
	}
}
