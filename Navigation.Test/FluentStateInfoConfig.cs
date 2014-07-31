using System;

namespace Navigation.Test
{
	public class FluentStateInfoConfig
	{
		public static void Register(FluentStateInfo stateInfo)
		{
			stateInfo
				.Dialog("d0", new
				{
					s0 = new WebFormsState("~/d0/s0.aspx").Title("s0"),
					s1 = new WebFormsState("~/d0/s1.aspx").Title("s1")
							.DefaultTypes(new {_bool = typeof(int), @short = typeof(short), @long = typeof(string)})
							.Defaults(new { @string = "Hello", _bool = true, _int = 0, @short = (short)1, @long = 2L, @float = 3F })
							.Derived("st1 "," bool ","  long")
							.Attributes(new { mobilePage = "~/mobile/d0/s1.aspx" }),
					s2 = new WebFormsState("~/d0/s2.aspx").Title("s2")
							.DefaultTypes(new { @string = typeof(string), DateTime = typeof(DateTime), @char = typeof(char), @byte = typeof(char) })
							.Defaults(new { emptyString = "", @double = 4D, @decimal = 5M, DateTime = new DateTime(1990, 3, 1, 12, 35, 47), @byte = (byte) 6, @char = (char) 7 })
							.Derived("string","decimal"),
					s3 = new WebFormsState("~/d0/s3.aspx").Title("s3")
							.DefaultTypes(new { s1 = typeof(string), s2 = typeof(int), b1 = typeof(bool), i1 = typeof(int), sh1 = typeof(short), l1 = typeof(long), f1 = typeof(float), d1 = typeof(double),
								de1 = typeof(decimal), dt2 = typeof(DateTime), t1 = typeof(TimeSpan), by1 = typeof(byte), ch1 = typeof(char), g1 = typeof(Guid) }),
					s4 = new WebFormsState("~/d0/s4.aspx").Title("s4")
							.DefaultTypes(new { @string = typeof(string), @bool = typeof(bool), @int = typeof(int), @short = typeof(short), @long = typeof(long), @float = typeof(float), @double = typeof(double),
								@decimal = typeof(decimal), DateTime = typeof(DateTime), TimeSpan = typeof(TimeSpan), @byte = typeof(byte), @char = typeof(char), Guid = typeof(Guid) }),
				}, d => d.s0)
					.Title("d0")
					.Attributes(new { path = " d0 " })
					.Transition("t0", d => d.s0, d => d.s1)
					.Transition("t1", d => d.s0, d => d.s2)
					.Transition("t2", d => d.s0, d => d.s3)
					.Transition("t3", d => d.s0, d => d.s4)
					.Transition("t0", d => d.s1, d => d.s2)
					.Transition("t1", d => d.s1, d => d.s3)
					.Transition("t2", d => d.s1, d => d.s4)
					.Transition("t0", d => d.s2, d => d.s3)
					.Transition("t1", d => d.s2, d => d.s4)
					.Transition("t0", d => d.s3, d => d.s4)
				.Build();
		}
	}
}
