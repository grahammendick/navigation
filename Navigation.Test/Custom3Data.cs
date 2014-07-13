using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;

namespace Navigation.Test
{
	[TypeConverter(typeof(Custom3DataTypeConverter))]
	public class Custom3Data
	{
	}
}
