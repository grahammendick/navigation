#if NET40Plus
namespace Navigation
{
	public static partial class FluentExtensions
	{
		/// <summary>
		/// Sets a value that indicates whether ASP.NET should validate that the user has authority to access the 
		/// physical page
		/// </summary>
		/// <typeparam name="K">The type of the <see cref="FluentState"/></typeparam>
		/// <param name="state">The <see cref="FluentState"/></param>
		/// <param name="check">Authority validation indicator</param>
		/// <returns>The <see cref="FluentState"/></returns>
		public static K CheckPhysicalUrlAccess<K>(this K state, bool check) where K : WebFormsState
		{
			state.AddAttribute("checkPhysicalUrlAccess", check ? "true" : "false");
			return state;
		}
	}
}
#endif
