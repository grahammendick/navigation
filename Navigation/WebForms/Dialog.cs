namespace Navigation
{
	public partial class Dialog
	{
		private string _Path;

		/// <summary>
		/// Gets the Url that will cause a navigation to the <see cref="Initial"/> state. It should not
		/// contain a query string although browsing to the Url with a query string will work and will pass
		/// the query string data as per normal <see cref="Navigation.NavigationData"/>
		/// </summary>
		public string Path
		{
			get
			{
				if (_Path == null)
					_Path = Attributes["path"] != null ? Attributes["path"].Trim() : string.Empty;
				return _Path;
			}
		}
	}
}
