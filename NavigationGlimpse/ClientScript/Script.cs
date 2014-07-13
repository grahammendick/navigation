using Glimpse.Core.Extensibility;
using Navigation.Glimpse.Resource;

namespace Navigation.Glimpse.ClientScript
{
	public class Script : IDynamicClientScript
	{
		public string GetResourceName()
		{
			return ScriptResource.InternalName;
		}

		public ScriptOrder Order
		{
			get
			{
				return ScriptOrder.IncludeAfterClientInterfaceScript;
			}
		}
	}
}