using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using System.Globalization;

namespace Navigation.Test
{
	public class Custom2DataTypeConverter : TypeConverter
	{
		public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
		{
			if (sourceType != typeof(string))
			{
				return base.CanConvertFrom(context, sourceType);
			}
			return true;
		}

		public override bool CanConvertTo(ITypeDescriptorContext context, Type destinationType)
		{
			if (destinationType != typeof(Custom2Data))
			{
				return base.CanConvertTo(context, destinationType);
			}
			return true;
		}

		public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
		{
			string str = value as string;
			return new Custom2Data()
			{
				Name = str.Substring(str.IndexOf(".") + 1),
				Age = int.Parse(str.Substring(0, str.IndexOf(".")), NumberFormatInfo.InvariantInfo)
			};
		}

		public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType)
		{
			Custom2Data customData = value as Custom2Data;
			return customData.Age.ToString(NumberFormatInfo.InvariantInfo) + "." + customData.Name;
		}
	}
}
