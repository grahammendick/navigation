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
			return StateInfoConfig.ParseNavigationDataExpression(entry.Expression.Trim(), null, false);
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
			CodeExpression[] parms = new CodeExpression[] { new CodePrimitiveExpression(entry.Expression.Trim()), new CodePrimitiveExpression(null), new CodePrimitiveExpression(false) };
			return new CodeMethodInvokeExpression(new CodeTypeReferenceExpression(new CodeTypeReference(typeof(StateInfoConfig), CodeTypeReferenceOptions.GlobalReference)), "ParseNavigationDataExpression", parms);
		}
	}
}
