namespace Navigation.Designer
{
	public static partial class TransitionBuilder
	{
		private static bool CanAcceptStateAsTarget(State target)
		{
			return true;
		}

		private static bool CanAcceptStateAndStateAsSourceAndTarget(State sourceState, State targetState)
		{
			if (sourceState != null && targetState == sourceState)
				return false;
			return true;
		}
	}
}
