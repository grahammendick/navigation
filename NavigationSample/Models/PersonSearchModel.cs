using System.Collections.Generic;

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
		public IEnumerable<Person> People
		{
			get;
			set;
		}
	}
}