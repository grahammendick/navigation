using System.Collections.Generic;

namespace Navigation.Sample.Models
{
	public class PersonApiSearchModel
	{
		public IEnumerable<PersonApiModel> People
		{
			get;
			set;
		}

		public int Total
		{
			get;
			set;
		}

		public string NextLink
		{
			get;
			set;
		}
	}
}