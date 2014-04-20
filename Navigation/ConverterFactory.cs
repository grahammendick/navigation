using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Globalization;
using System.Reflection;

namespace Navigation
{
	internal static class ConverterFactory
	{
		private static Type[][] _TypeArray = new Type[][]{
		    new Type[]{typeof(string), typeof(StringConverter)},
		    new Type[]{typeof(bool), typeof(BooleanConverter)},
		    new Type[]{typeof(short), typeof(Int16Converter)},
		    new Type[]{typeof(int), typeof(Int32Converter)},
		    new Type[]{typeof(long), typeof(Int64Converter)},
		    new Type[]{typeof(float), typeof(SingleConverter)},
		    new Type[]{typeof(double), typeof(DoubleConverter)},
		    new Type[]{typeof(decimal), typeof(DecimalConverter)},
		    new Type[]{typeof(DateTime), typeof(DateTimeConverter)},
		    new Type[]{typeof(TimeSpan), typeof(TimeSpanConverter)},
		    new Type[]{typeof(byte), typeof(ByteConverter)},
		    new Type[]{typeof(char), typeof(CharConverter)},
		    new Type[]{typeof(Guid), typeof(GuidConverter)},
		};
		private static Dictionary<string, TypeConverter> _KeyToConverterList = CreateKeyToConverterList();
		private static Dictionary<string, string> _TypeToKeyList = CreateTypeToKeyList();

		private static IEnumerable<Type[]> Converters
		{
			get
			{
				foreach (Type[] arr in _TypeArray)
				{
					yield return arr;
				}
				List<Type[]> extraConverters = (List<Type[]>)ConfigurationManager.GetSection("Navigation/NavigationData");
				if (extraConverters != null)
				{
					foreach (Type[] extraPar in extraConverters)
					{
						yield return extraPar;
					}
				}
			}
		}

		private static Dictionary<string, TypeConverter> CreateKeyToConverterList()
		{
			Dictionary<string, TypeConverter> keyToConverterList = new Dictionary<string, TypeConverter>();
			string key;
			int i = 0;
			TypeConverter typeConverter;
			foreach (Type[] arr in Converters)
			{
				key = i.ToString(NumberFormatInfo.InvariantInfo);
				keyToConverterList.Add(key, GetTypeConverter(arr[0], arr[1]));
				keyToConverterList.Add("a" + key, (TypeConverter)typeof(ListConverter<>).MakeGenericType(new Type[] { typeof(ArrayList) }).GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, new Type[] { typeof(TypeConverter) }, null).Invoke(new object[] { GetTypeConverter(arr[0], arr[1]) }));
				keyToConverterList.Add("l" + key, (TypeConverter)typeof(ListConverter<>).MakeGenericType(new Type[] { typeof(List<>).MakeGenericType(new Type[] { arr[0] }) }).GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, new Type[] { typeof(TypeConverter) }, null).Invoke(new object[] { GetTypeConverter(arr[0], arr[1]) }));
				typeConverter = (TypeConverter) keyToConverterList["a" + key];
				if (!typeConverter.CanConvertFrom(typeof(string)) || !typeConverter.CanConvertTo(typeof(string)))
					throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidConversion, arr[0].Name));
				typeConverter = (TypeConverter)keyToConverterList["l" + key];
				if (!typeConverter.CanConvertFrom(typeof(string)) || !typeConverter.CanConvertTo(typeof(string)))
					throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidConversion, arr[0].Name));
				i++;
			}
			return keyToConverterList;
		}

		private static TypeConverter GetTypeConverter(Type from, Type converter)
		{
			TypeConverter typeConverter;
			if (converter == typeof(EnumConverter))
				typeConverter = new EnumConverter(from);
			else
				typeConverter = (TypeConverter)Activator.CreateInstance(converter);
			return typeConverter;
		}

		private static Dictionary<string, string> CreateTypeToKeyList()
		{
			Dictionary<string, string> typeToKeyList = new Dictionary<string, string>();
			string key;
			int i = 0;
			foreach (Type[] arr in Converters)
			{
				key = i.ToString(NumberFormatInfo.InvariantInfo);
				typeToKeyList.Add(arr[0].AssemblyQualifiedName, key);
				typeToKeyList.Add(typeof(ArrayList).AssemblyQualifiedName + "#" + arr[0].AssemblyQualifiedName, "a" + key);
				typeToKeyList.Add(typeof(List<>).MakeGenericType(new Type[] { arr[0] }).AssemblyQualifiedName + "#" + arr[0].AssemblyQualifiedName, "l" + key);
				i++;
			}
			return typeToKeyList;
		}

		internal static string GetKey(Type type)
		{
			return _TypeToKeyList[type.AssemblyQualifiedName];
		}

		internal static string GetKey(object obj)
		{
			string fullType = obj.GetType().AssemblyQualifiedName;
			IEnumerable enumer = obj as IEnumerable;
			Type type2 = null;
			if (enumer != null)
			{
				if (obj.GetType().IsGenericType && obj.GetType().GetGenericTypeDefinition() == typeof(List<>))
				{
					type2 = obj.GetType().GetGenericArguments()[0];
				}
				else
				{
					if (obj.GetType() == typeof(ArrayList))
					{
						type2 = typeof(string);
						foreach (object item in enumer)
						{
							if (item != null)
							{
								type2 = item.GetType();
								break;
							}
						}
					}
				}
				if (type2 != null)
					fullType = fullType + "#" + type2.AssemblyQualifiedName;
			}
			if (!_TypeToKeyList.ContainsKey(fullType))
			{
				throw new ArgumentException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidNavigationData, type2 == null ? obj.GetType().Name : type2.Name));
			}
			return _TypeToKeyList[fullType];
		}

		internal static TypeConverter GetConverter(string key)
		{
			return _KeyToConverterList[key];
		}

	}
}
