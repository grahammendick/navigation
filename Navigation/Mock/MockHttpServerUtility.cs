#if NET40Plus
using System.Web;

namespace Navigation
{
	internal class MockHttpServerUtility : HttpServerUtilityBase
	{
		internal MockHttpServerUtility(State state)
			: base()
		{
			State = state;
		}

		private State State
		{
			get;
			set;
		}

		public override void Transfer(string path)
		{
			Transfer(path, false);
		}

		public override void Transfer(string path, bool preserveForm)
		{
			StateContext.StateId = State.Id;
			StateController.SetStateContext(new MockNavigationContext(path, State));
		}
	}
}
#endif
