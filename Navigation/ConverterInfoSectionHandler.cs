using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Globalization;
using System.Xml;

namespace Navigation
{
	/// <summary>
	/// Provides access to the Navigation/NavigationData section and is not intended to be used outside
	/// of the Navigation framework
	/// </summary>
	public sealed class ConverterInfoSectionHandler : IConfigurationSectionHandler
	{
		object IConfigurationSectionHandler.Create(object parent, object configContext, XmlNode section)
		{
			List<Type[]> converterList = new List<Type[]>();
			Type[] typeArray = null;
			XmlNode converter;
			Type converterType;
			TypeConverter typeConverter;
			for (int i = 0; i < section.ChildNodes.Count; i++)
			{
				converter = section.ChildNodes[i];
				if (converter.NodeType != XmlNodeType.Comment)
				{
					if (converter.Attributes["converter"] == null)
					{
						if (converter.Attributes["type"] == null)
							throw new ConfigurationErrorsException(Resources.TypeAttributeMissing);
						if (Type.GetType(converter.Attributes["type"].Value) == null)
							throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidTypeAttribute, converter.Attributes["type"].Value));
						if (Type.GetType(converter.Attributes["type"].Value).IsEnum)
						{
							converterType = typeof(EnumConverter);
						}
						else
						{
							converterType = TypeDescriptor.GetConverter(Type.GetType(converter.Attributes["type"].Value)).GetType();
							typeConverter = Activator.CreateInstance(converterType) as TypeConverter;
							if (!typeConverter.CanConvertFrom(typeof(string)) || !typeConverter.CanConvertTo(typeof(string)))
								throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidConversion, converterType.Name));
						}
					}
					else
					{
						converterType = Type.GetType(converter.Attributes["converter"].Value);
						if (converterType == null)
							throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidConverterAttribute, converter.Attributes["converter"].Value));
						typeConverter = Activator.CreateInstance(converterType) as TypeConverter;
						if (typeConverter == null)
							throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidConverterAttribute, converterType.Name));
						if (!typeConverter.CanConvertFrom(typeof(string)) || !typeConverter.CanConvertTo(typeof(string)))
							throw new ConfigurationErrorsException(string.Format(CultureInfo.CurrentCulture, Resources.InvalidConversion, converterType.Name));
					}
					typeArray = new Type[] { Type.GetType(converter.Attributes["type"].Value), converterType };
					converterList.Add(typeArray);
				}
			}
			return converterList;
		}
	}
}
