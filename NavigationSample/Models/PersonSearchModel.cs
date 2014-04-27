using System.Collections.Generic;
using System.ComponentModel;

namespace Navigation.Sample.Models
{
	public class PersonSearchModel
	{
		public string Name
		{
			get;
			set;
		}

		[DisplayName("Min Date of Birth")]
		public string MinDateOfBirth
		{
			get;
			set;
		}

		public IEnumerable<Person> People
		{
			get;
			set;
		}
	}
}