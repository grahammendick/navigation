using Glimpse.Core.Extensibility;
using NavigationGlimpse.Resource;

namespace NavigationGlimpse.ClientScript
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