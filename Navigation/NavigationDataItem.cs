namespace Navigation
{
	/// <summary>
	/// The <see cref="System.Type"/> of items returned when enumerating 
	/// over <see cref="Navigation.NavigationData"/>
	/// </summary>
	public class NavigationDataItem
	{
		/// <summary>
		/// Gets the key of the item
		/// </summary>
		public string Key
		{
			get;
			private set;
		}

		/// <summary>
		/// Gets the value of the item
		/// </summary>
		public object Value
		{
			get;
			private set;
		}

		internal NavigationDataItem(string key, object value)
		{
			Key = key;
			Value = value;
		}
	}
}
