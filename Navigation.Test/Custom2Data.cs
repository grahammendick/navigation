using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Navigation.Test
{
	public class Custom2Data
	{
		public string Name
		{
			get;
			set;
		}

		public int Age
		{
			get;
			set;
		}

		public override int GetHashCode()
		{
			return Name.GetHashCode() ^ Age.GetHashCode();
		}

		public override bool Equals(object obj)
		{
			if (!(obj is Custom2Data))
				return false;
			Custom2Data to = obj as Custom2Data;
			if (this == null)
				return to == null;
			if (to == null)
				return false;
			return this.Name == to.Name && this.Age == to.Age;
		}
	}
}
