using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using System.Globalization;

namespace Navigation.Test
{
	public class CustomDataTypeConverter : TypeConverter
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
			if (destinationType != typeof(CustomData))
			{
				return base.CanConvertTo(context, destinationType);
			}
			return true;
		}

		public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
		{
			string str = value as string;
			return new CustomData()
			{
				Name = str.Substring(str.IndexOf(".") + 1),
				Age = int.Parse(str.Substring(0, str.IndexOf(".")), NumberFormatInfo.InvariantInfo)
			};
		}

		public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType)
		{
			CustomData customData = value as CustomData;
			return customData.Age.ToString(NumberFormatInfo.InvariantInfo) + "." + customData.Name;
		}
	}
}
