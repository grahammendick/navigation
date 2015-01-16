using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;

namespace Navigation.Test
{
	[TypeConverter(typeof(CustomDataTypeConverter))]
	public class CustomData
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
			if (!(obj is CustomData))
				return false;
			CustomData to = obj as CustomData;
			if (this == null)
				return to == null;
			if (to == null)
				return false;
			return this.Name == to.Name && this.Age == to.Age;
		}
	}
}
