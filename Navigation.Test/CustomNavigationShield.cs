using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Navigation.Test
{
	public class CustomNavigationShield : ChecksumNavigationShield
	{
		private bool Skip(State state)
		{
			return state == StateInfoConfig.Dialogs["d0"].States["s2"] || state == StateInfoConfig.Dialogs["d3"].States["s2"]
				|| state == StateInfoConfig.Dialogs["d2"].States["s0"] || state == StateInfoConfig.Dialogs["d5"].States["s0"]
				|| state.Parent.Key == "d6";
		}

#if NET35Plus
		public override NameValueCollection Encode(NameValueCollection data, bool historyPoint, State state)
		{
			if (Skip(state))
				return data;
			return base.Encode(data, historyPoint, state);
		}

		public override NameValueCollection Decode(NameValueCollection data, bool historyPoint, State state)
		{
			if (Skip(state))
				return data;
			return base.Decode(data, historyPoint, state);
		}
#else
		public override NameValueCollection Encode(NameValueCollection data, State state)
		{
			if (Skip(state))
				return data;
			return base.Encode(data, state);
		}

		public override NameValueCollection Decode(NameValueCollection data, State state)
		{
			if (Skip(state))
				return data;
			return base.Decode(data, state);
		}
#endif
	}
}
