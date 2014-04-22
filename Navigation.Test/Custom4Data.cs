using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;

namespace Navigation.Test
{
	[TypeConverter(typeof(Custom4DataTypeConverter))]
	public class Custom4Data
	{
	}
}
