using System;
using System.Collections;
using System.ComponentModel;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Navigation
{
	internal sealed class ListConverter<T> : TypeConverter where T : IEnumerable, IList, new()
	{
		private TypeConverter _Converter = null;
		private const string separator = "_";
		private const string separator1 = "1" + separator;
		private const string separator2 = "2" + separator;

		internal ListConverter(TypeConverter parser)
		{
			_Converter = parser;
		}

		public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
		{
			return _Converter.CanConvertFrom(context, sourceType);
		}

		public override bool CanConvertTo(ITypeDescriptorContext context, Type destinationType)
		{
			return _Converter.CanConvertTo(context, destinationType);
		}

		public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
		{
			IList obj = new T();
			string val = value as string;
			if (val.Length != 0)
			{
				string[] vals = Regex.Split(val, separator1);
				for (int i = 0; i < vals.Length; i++)
				{
					if (vals[i].Length != 0)
						obj.Add(_Converter.ConvertFromInvariantString(vals[i].Replace(separator2, separator)));
					else
						obj.Add(null);
				}
			}
			return obj;
		}

		public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType)
		{
			StringBuilder formatString = new StringBuilder();
			IEnumerable objList = value as IEnumerable;
			foreach (object item in objList)
			{
				if (item != null)
					formatString.Append(_Converter.ConvertToInvariantString(item).Replace(separator, separator2));
				formatString.Append(separator1);
			}
			if (formatString.Length > 0)
				formatString.Remove(formatString.Length - 2, 2);
			return formatString.ToString();
		}
	}
}
