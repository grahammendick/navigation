using System.Collections.Generic;
using System.ComponentModel;

namespace Navigation.Sample.Models
{
	public class PersonSearchModel
	{
		public string Name
		{
			get
			{
				return StateContext.Bag.name;
			}
			set
			{
				StateContext.Bag.name = value;
			}
		}

		[DisplayName("Min Date of Birth")]
		public string MinDateOfBirth
		{
			get
			{
				return StateContext.Bag.minDateOfBirth;
			}
			set
			{
				StateContext.Bag.minDateOfBirth = value;
			}
		}

		public IEnumerable<Person> People
		{
			get;
			set;
		}
	}
}