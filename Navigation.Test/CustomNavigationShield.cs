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
#if NET35Plus
		public override NameValueCollection Encode(NameValueCollection data, bool historyPoint, State state)
		{
			return base.Encode(data, historyPoint, state);
		}

		public override NameValueCollection Decode(NameValueCollection data, bool historyPoint, State state)
		{
			return base.Decode(data, historyPoint, state);
		}
#else
		public override NameValueCollection Encode(NameValueCollection data, State state)
		{
			return base.Encode(data, state);
		}

		public override NameValueCollection Decode(NameValueCollection data, State state)
		{
			return base.Decode(data, state);
		}
#endif
	}
}
