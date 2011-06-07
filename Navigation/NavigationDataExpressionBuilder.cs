using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Compilation;
using System.Web.UI;
using Navigation.Properties;

namespace Navigation
{
	/// <summary>
	/// Creates <see cref="Navigation.NavigationData"/> that corresponds to specified key/value pairs.
	/// </summary>
	public class NavigationDataExpressionBuilder : ExpressionBuilder
	{
		private static Dictionary<string, TypeCode> _KeyToTypeList = CreateKeyToTypeList();

		private static Dictionary<string, TypeCode> CreateKeyToTypeList()
		{
			Dictionary<string, TypeCode> list = new Dictionary<string, TypeCode>();
			list.Add("STRING", TypeCode.String);
			list.Add("BOOL", TypeCode.Boolean);
			list.Add("SHORT", TypeCode.Int16);
			list.Add("INT", TypeCode.Int32);
			list.Add("LONG", TypeCode.Int64);
			list.Add("FLOAT", TypeCode.Single);
			list.Add("DOUBLE", TypeCode.Double);
			list.Add("DECIMAL", TypeCode.Decimal);
			list.Add("DATETIME", TypeCode.DateTime);
			list.Add("BYTE", TypeCode.Byte);
			list.Add("CHAR", TypeCode.Char);
			return list;
		}

		/// <summary>
		/// Creates <see cref="Navigation.NavigationData"/> that corresponds to specified key/value pairs
		/// </summary>
		/// <param name="target">Not used in this implementation</param>
		/// <param name="entry">The property that the expression is bound to</param>
		/// <param name="parsedData">Not used in this implementation</param>
		/// <param name="context">Not used in this implementation</param>
		/// <returns>The <see cref="Navigation.NavigationData"/> that corresponds to specified key/value pairs</returns>
		public override object EvaluateExpression(object target, BoundPropertyEntry entry, object parsedData, ExpressionBuilderContext context)
		{
			return GetNavigationData(entry.Expression.Trim());
		}

		/// <summary>
		///  Returns a code expression that is used to perform the property assignment in the generated page class
		/// </summary>
		/// <param name="entry">The property that the expression is bound to</param>
		/// <param name="parsedData">Not used in this implementation</param>
		/// <param name="context">Not used in this implementation</param>
		/// <returns>A <see cref="System.CodeDom.CodeExpression"/> instance that is used in the property assignment</returns>
		public override CodeExpression GetCodeExpression(BoundPropertyEntry entry, object parsedData, ExpressionBuilderContext context)
		{
			return new CodeMethodInvokeExpression(new CodeTypeReferenceExpression(GetType()), "GetNavigationData", new CodeExpression[] { new CodePrimitiveExpression(entry.Expression.Trim()) });
		}

		/// <summary>
		/// Creates <see cref="Navigation.NavigationData"/> that corresponds to specified key/value pairs
		/// </summary>
		/// <param name="expression">The expression as specified in markup</param>
		/// <returns>The <see cref="Navigation.NavigationData"/> that corresponds to specified key/value pairs</returns>
		/// <exception cref="System.InvalidOperationException">The method was unable to parse the expression that was specified in markup</exception>
		public static NavigationData GetNavigationData(string expression)
		{
			NavigationData data = new NavigationData();
			if (!TryParseNavigationDataExpression(expression, data))
			{
				throw new InvalidOperationException(Resources.InvalidExpression);
			}
			return data;
		}

		internal static bool TryParseNavigationDataExpression(string expression, NavigationData data)
		{
			if (string.IsNullOrEmpty(expression))
				return false;
			string[] keyTypeValue, keyType;
			string key, value, type;
			foreach (string dataItem in expression.Split(new char[] { ',' }))
			{
				keyTypeValue = dataItem.Split(new char[] { '=' });
				if (keyTypeValue.Length != 2)
					return false;
				keyType = keyTypeValue[0].Trim().Split(new char[] { '?' });
				if (keyType.Length > 2)
					return false;
				value = keyTypeValue[1].Trim();
				key = keyType[0].Trim();
				if (string.IsNullOrEmpty(key))
					return false;
				type = "STRING";
				if (keyType.Length == 2)
					type = keyType[1].Trim();
				type = type.ToUpperInvariant();
				if (!_KeyToTypeList.ContainsKey(type))
					return false;
				data[key] = Convert.ChangeType(value, _KeyToTypeList[type], CultureInfo.CurrentCulture);
			}
			return true;
		}
	}
}
