using Glimpse.Core.Extensibility;
using Glimpse.Core.Resource;

namespace NavigationGlimpse.Resource
{
	public class ScriptResource : FileResource, IKey
	{
		internal const string InternalName = "navigationglimpse_client";

		private EmbeddedResourceInfo GlimpseClientEmbeddedResourceInfo { get; set; }

		public ScriptResource()
		{
			Name = InternalName;
			GlimpseClientEmbeddedResourceInfo = new EmbeddedResourceInfo(
				this.GetType().Assembly,
				"NavigationGlimpse.navigation.glimpse.js",
				"application/x-javascript");
		}

		public string Key
		{
			get
			{
				return Name;
			}
		}

		protected override EmbeddedResourceInfo GetEmbeddedResourceInfo(IResourceContext context)
		{
			return GlimpseClientEmbeddedResourceInfo;
		}
	}
}
