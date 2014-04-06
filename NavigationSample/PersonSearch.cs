using System;
using System.Collections.Generic;
using System.Linq;

namespace Navigation.Sample
{
	public class PersonSearch
	{
		private static List<Person> _People = new List<Person>()
		{
			new Person(){Id = 1, Name = "Bob", DateOfBirth = new DateTime(1980, 12, 12)},
			new Person(){Id = 2, Name = "Brenda", DateOfBirth = new DateTime(1970, 6,1)},
			new Person(){Id = 3, Name = "Barney", DateOfBirth = new DateTime(1960, 10,25)},
			new Person(){Id = 4, Name = "Billy" , DateOfBirth = new DateTime(1980, 12,12)},
			new Person(){Id = 5, Name = "Bertha", DateOfBirth = new DateTime(1970, 6, 1)},
			new Person(){Id = 6, Name = "Bert", DateOfBirth = new DateTime(1960, 10, 25)},
			new Person(){Id = 7, Name = "Benny" , DateOfBirth = new DateTime(1980, 12,12)},
			new Person(){Id = 8, Name = "Bella", DateOfBirth = new DateTime(1970, 6, 1)},
			new Person(){Id = 9, Name = "Bridget", DateOfBirth = new DateTime(1960,10,25)},
			new Person(){Id = 10, Name = "Beth" , DateOfBirth = new DateTime(1980, 12,12)},
			new Person(){Id = 11, Name = "Brian", DateOfBirth = new DateTime(1970, 6, 1)},
			new Person(){Id = 12, Name = "Bessie", DateOfBirth = new DateTime(1960,10,25)},
		};

		public IEnumerable<Person> Search(
			[NavigationData] string name,
			[NavigationData] string minDateOfBirth,
			[NavigationData] string sortExpression,
			[NavigationData] int startRowIndex,
			[NavigationData] int maximumRows)
		{
			var q = from p in _People
					where (name == null || p.Name.ToUpperInvariant().Contains(name.ToUpperInvariant()))
					&& (minDateOfBirth == null || p.DateOfBirth >= DateTime.Parse(minDateOfBirth))
					select p;
			if (sortExpression != null)
				q = !sortExpression.EndsWith("DESC") ? q.OrderBy(p => p.Name) : q.OrderByDescending(p => p.Name);
			StateContext.Data["totalRowCount"] = q.Count();
			return q.Skip(startRowIndex).Take(maximumRows);
		}

		public Person GetDetails([NavigationData] int id)
		{
			return (from p in _People
					where p.Id == id
					select p).First();
		}
	}
}