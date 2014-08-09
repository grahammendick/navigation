using System;
using System.Collections.Generic;

namespace Navigation.Test
{
	public class FluentStateInfoConfig
	{
		public static void Register(FluentStateInfo stateInfo)
		{
			stateInfo
				.Dialog("d0", new
				{
					s0 = new WebFormsState("", "~/d0/s0.aspx")
							.Title("s0"),
					s1 = new WebFormsState("", " ~/d0/s1.aspx  ")
							.Title("s1")
							.Defaults(new { _bool = typeof(int), @short = typeof(short), @long = typeof(string) })
							.Defaults(new { @string = "Hello", _bool = true, _int = 0, @short = (short)1, @long = 2L, @float = 3F })
							.Derived("st1 ", " bool ", "  long")
							.Attributes(new { mobilePage = "~/mobile/d0/s1.aspx" }),
					s2 = new WebFormsState("", "~/d0/s2.aspx")
							.Title("s2")
							.Defaults(new { @string = typeof(string), DateTime = typeof(DateTime), @char = typeof(char), @byte = typeof(char) })
							.Defaults(new { emptyString = "", @double = 4D, @decimal = 5M, DateTime = new DateTime(1990, 3, 1, 12, 35, 47), @byte = (byte)6, @char = '7' })
							.Derived("string", "decimal"),
					s3 = new WebFormsState("", "~/d0/s3.aspx")
							.Title("s3")
							.Defaults(new { s1 = typeof(string), s2 = typeof(int), b1 = typeof(bool), i1 = typeof(int), sh1 = typeof(short), l1 = typeof(long), f1 = typeof(float), d1 = typeof(double), de1 = typeof(decimal), dt2 = typeof(DateTime), t1 = typeof(TimeSpan), by1 = typeof(byte), ch1 = typeof(char), g1 = typeof(Guid) }),
					s4 = new WebFormsState("", "~/d0/s4.aspx")
							.Title("s4")
							.Defaults(new { @string = typeof(string), @bool = typeof(bool), @int = typeof(int), @short = typeof(short), @long = typeof(long), @float = typeof(float), @double = typeof(double), @decimal = typeof(decimal), DateTime = typeof(DateTime), TimeSpan = typeof(TimeSpan), @byte = typeof(byte), @char = typeof(char), Guid = typeof(Guid) }),
				}, d => d.s0)
					.Title("d0")
					.Path(" d0 ")
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
				.Dialog("d1", new
				{
					s0 = new WebFormsState("", "~/d1/s0.aspx")
							.Title("s0")
							.Defaults(new Dictionary<string, object> { { "_0_1_2_3_4_5_", typeof(int) }, { "*/()-_+~@:?><.;[]{}!£$%^#&", typeof(short) } })
							.Attributes(new { theme = "  test ", masters = "test1  , test2 " }),
					s1 = new WebFormsState("", "~/d1/s1.aspx")
							.Title("s1")
							.Defaults(new { s1 = typeof(string), s2 = typeof(bool), b1 = typeof(bool), b2 = typeof(int), i1 = typeof(int), i2 = typeof(short), sh1 = typeof(short), sh2 = typeof(long), l1 = typeof(long), l2 = typeof(float), f1 = typeof(float), f2 = typeof(double), d1 = typeof(double), d2 = typeof(decimal), de1 = typeof(decimal), de2 = typeof(DateTime), dt1 = typeof(DateTime), dt2 = typeof(TimeSpan), t1 = typeof(TimeSpan), by1 = typeof(byte), by2 = typeof(char), ch1 = typeof(char), ch2 = typeof(Guid), g1 = typeof(Guid) })
							.Defaults(new Dictionary<string, object> { { "  &s0", "a" } })
							.Defaults(new { s1 = "b", s2 = "c", s3 = "d", b1 = true, b2 = false, b3 = true, i1 = 0, i2 =1, i3 = 2, sh1 = (short) 3, sh2 = (short) 4, sh3 = (short) 5, l1 = 6L, l2 = 7L, l3 = 8L, f1 = 9F, f2 = 10F, f3 = 11F, d1 = 12D, d2 = 13D,d3 = 14D, de1 = 15M, de2 = 16M, de3 = 17M, dt1 = new DateTime(1990, 3, 1, 12, 35, 47), dt2 = new DateTime(1991, 4, 2, 13, 36, 48), dt3 = new DateTime(1992, 5, 3, 14, 37, 49), t1 = "d", by1 = (byte) 18, by2 = (byte) 19, by3 = (byte) 20, ch1 = 'e', ch2 = 'f', ch3 = 'g', g1 ="h" })
							.Attributes(new { masters = ",", mobilePage = "  ~/mobile/d1/s1.aspx " }),
					s2 = new WebFormsState("", "~/d1/s2.aspx")
							.Title("s2")
							.Attributes(new { masters = "!@" }),
					s3 = new WebFormsState("", "~/d1/s3.aspx")
							.Title("s3")
							.Attributes(new { mobileTheme = " test  ", mobileMasters = " test1 ,  test2" }),
					s4 = new WebFormsState("", "~/d1/s4.aspx")
							.Title("s4")
							.Attributes(new { mobileMasters = "," }),
					s5 = new WebFormsState("", "~/d1/s5.aspx")
							.Title("s5")
							.Attributes(new { mobileMasters = "!@" }),
				}, d => d.s0)
					.Title("d1")
					.Attributes(new { path = "d1" })
					.Transition("t0", d => d.s0, d => d.s1)
					.Transition("t0", d => d.s1, d => d.s2)
					.Transition("t0", d => d.s2, d => d.s3)
					.Transition("t0", d => d.s3, d => d.s4)
					.Transition("t0", d => d.s4, d => d.s5)
					.Transition("t0", d => d.s5, d => d.s0)
					.Transition("t1", d => d.s5, d => d.s1)
					.Transition("t2", d => d.s5, d => d.s2)
					.Transition("t3", d => d.s5, d => d.s3)
					.Transition("t4", d => d.s5, d => d.s4)
				.Dialog("d2", new
				{
					s0 = new WebFormsState("", "~/d2/s0.aspx")
							.Title("s0")
							.TrackCrumbTrail(false),
					s1 = new WebFormsState("", "~/d2/s1.aspx")
							.Title("s1")
							.TrackCrumbTrail(true)
							.Attributes(new { mobilePage = "~/mobile/d2/s1.aspx" }),
					s2 = new WebFormsState("", "~/d2/s2.aspx")
							.Title("s2")
							.TrackCrumbTrail(false),
					s3 = new WebFormsState("", "~/d2/s3.aspx")
							.Title("s3")
							.TrackCrumbTrail(true),
					s4 = new WebFormsState("", "~/d2/s4.aspx")
							.Title("s4")
							.TrackCrumbTrail(false),
					s5 = new WebFormsState("", "~/d2/s5.aspx")
							.Title("s5"),
					s6 = new WebFormsState("", "~/d2/s6.aspx")
							.Title("s6"),
				}, d => d.s0)
					.Title("d2")
					.Path("d2")
					.Transition("t0", d => d.s0, d => d.s1)
					.Transition("t0", d => d.s1, d => d.s2)
					.Transition("t0", d => d.s2, d => d.s3)
					.Transition("t0", d => d.s3, d => d.s4)
					.Transition("t0", d => d.s4, d => d.s5)
					.Transition("t0", d => d.s5, d => d.s6)
					.Transition("t0", d => d.s6, d => d.s0)
				.Dialog("d3", new
				{
					s0 = new WebFormsState("d3s0", "~/d3/s0.aspx")
							.Title("s0")
							.Attributes(new { mobileRoute = "m/d3s0" }),
					s1 = new WebFormsState("d3s1/{string}/{short}", "~/d3/s1.aspx")
							.Title("s1")
							.Defaults(new { _bool = typeof(int), @short = typeof(short), @long = typeof(string) })
							.Defaults(new { @string = "Hello", _bool = true, _int = 0, @short = (short)1, @long = 2L, @float = 3F })
							.Derived("st1 ", " bool ", "  long")
							.Attributes(new { mobileRoute = "" }),
					s2 = new WebFormsState("d3s2/{char}/{*double}", "~/d3/s2.aspx")
							.Title("s2")
							.Defaults(new { @string = typeof(string), DateTime = typeof(DateTime), @char = typeof(char), @byte = typeof(char) })
							.Defaults(new { emptyString = "", @double = 4D, @decimal = 5M, DateTime = new DateTime(1990, 3, 1, 12, 35, 47), @byte = (byte)6, @char = '7' })
							.Derived("string", "decimal")
							.Attributes(new { mobilePage = "~/mobile/d3/s2.aspx" }),
					s3 = new WebFormsState("d3s3/{*s}", "~/d3/s3.aspx")
							.Title("s3")
							.Defaults(new { s1 = typeof(string), s2 = typeof(int), b1 = typeof(bool), i1 = typeof(int), sh1 = typeof(short), l1 = typeof(long), f1 = typeof(float), d1 = typeof(double), de1 = typeof(decimal), dt2 = typeof(DateTime), t1 = typeof(TimeSpan), by1 = typeof(byte), ch1 = typeof(char), g1 = typeof(Guid) })
							.Attributes(new { mobileTheme = "theme" }),
					s4 = new WebFormsState("d3s4", "~/d3/s4.aspx")
							.Title("s4")
							.Defaults(new { @string = typeof(string), @bool = typeof(bool), @int = typeof(int), @short = typeof(short), @long = typeof(long), @float = typeof(float), @double = typeof(double), @decimal = typeof(decimal), DateTime = typeof(DateTime), TimeSpan = typeof(TimeSpan), @byte = typeof(byte), @char = typeof(char), Guid = typeof(Guid) })
							.Attributes(new { mobileMasters = "" }),
				}, d => d.s0)
					.Title("d3")
					.Attributes(new { path = "d3" })
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
				.Dialog("d4", new
				{
					s0 = new WebFormsState("d4s0", "~/d4/s0.aspx")
							.Title("s0")
							.Defaults(new Dictionary<string, object> { { "_0_1_2_3_4_5_", typeof(int) }, { "*/()-_+~@:?><.;[]{}!£$%^#&", typeof(short) } }),
					s1 = new WebFormsState("{s1}/{*s}", "~/d4/s1.aspx")
							.Title("s1")
							.Defaults(new { s1 = typeof(string), s2 = typeof(bool), b1 = typeof(bool), b2 = typeof(int), i1 = typeof(int), i2 = typeof(short), sh1 = typeof(short), sh2 = typeof(long), l1 = typeof(long), l2 = typeof(float), f1 = typeof(float), f2 = typeof(double), d1 = typeof(double), d2 = typeof(decimal), de1 = typeof(decimal), de2 = typeof(DateTime), dt1 = typeof(DateTime), dt2 = typeof(TimeSpan), t1 = typeof(TimeSpan), by1 = typeof(byte), by2 = typeof(char), ch1 = typeof(char), ch2 = typeof(Guid), g1 = typeof(Guid) })
							.Defaults(new Dictionary<string, object> { { "  &s0", "a" } })
							.Defaults(new { s1 = "b", s2 = "c", s3 = "d", b1 = true, b2 = false, b3 = true, i1 = 0, i2 =1, i3 = 2, sh1 = (short) 3, sh2 = (short) 4, sh3 = (short) 5, l1 = 6L, l2 = 7L, l3 = 8L, f1 = 9F, f2 = 10F, f3 = 11F, d1 = 12D, d2 = 13D,d3 = 14D, de1 = 15M, de2 = 16M, de3 = 17M, dt1 = new DateTime(1990, 3, 1, 12, 35, 47), dt2 = new DateTime(1991, 4, 2, 13, 36, 48), dt3 = new DateTime(1992, 5, 3, 14, 37, 49), t1 = "d", by1 = (byte) 18, by2 = (byte) 19, by3 = (byte) 20, ch1 = 'e', ch2 = 'f', ch3 = 'g', g1 ="h" }),
					s2 = new WebFormsState("d4s2", "~/d4/s2.aspx")
							.Title("s2"),
					s3 = new WebFormsState("d4s3", "~/d4/s3.aspx")
							.Title("s3"),
					s4 = new WebFormsState("d4s4/{s1}/{s2}", "~/d4/s4.aspx")
							.Title("s4"),
					s5 = new WebFormsState(" d4s5", "~/d4/s5.aspx")
							.Title("s5")
							.Attributes(new { mobileRoute = "md4s5 " }),
				}, d => d.s0)
					.Title("d4")
					.Path("d4")
					.Transition("t0", d => d.s0, d => d.s1)
					.Transition("t0", d => d.s1, d => d.s2)
					.Transition("t0", d => d.s2, d => d.s3)
					.Transition("t0", d => d.s3, d => d.s4)
					.Transition("t0", d => d.s4, d => d.s5)
					.Transition("t0", d => d.s5, d => d.s0)
					.Transition("t1", d => d.s5, d => d.s1)
					.Transition("t2", d => d.s5, d => d.s2)
					.Transition("t3", d => d.s5, d => d.s3)
					.Transition("t4", d => d.s5, d => d.s4)
				.Dialog("d5", new
				{
					s0 = new WebFormsState("d5s0", "~/d5/s0.aspx")
							.Title("s0")
							.TrackCrumbTrail(false),
					s1 = new WebFormsState("d5s1", "~/d5/s1.aspx")
							.Title("s1")
							.TrackCrumbTrail(true),
					s2 = new WebFormsState("d5s2", "~/d5/s2.aspx")
							.Title("s2")
							.TrackCrumbTrail(false),
					s3 = new WebFormsState("d5s3", "~/d5/s3.aspx")
							.Title("s3")
							.TrackCrumbTrail(true),
					s4 = new WebFormsState("d5s4", "~/d5/s4.aspx")
							.Title("s4")
							.TrackCrumbTrail(false),
					s5 = new WebFormsState("d5s5", "~/d5/s5.aspx")
							.Title("s5"),
					s6 = new WebFormsState("d5s6", "~/d5/s6.aspx")
							.Title("s6"),
				}, d => d.s0)
					.Title("d5")
					.Attributes(new { path = "d5" })
					.Transition("t0", d => d.s0, d => d.s1)
					.Transition("t0", d => d.s1, d => d.s2)
					.Transition("t0", d => d.s2, d => d.s3)
					.Transition("t0", d => d.s3, d => d.s4)
					.Transition("t0", d => d.s4, d => d.s5)
					.Transition("t0", d => d.s5, d => d.s6)
					.Transition("t0", d => d.s6, d => d.s0)
				.Dialog("d6", new
				{
					s0 = new CustomState("~/d6/s0.aspx")
							.Title("s0"),
					s1 = new CustomState("~/d6/s1.aspx")
							.Title("s1"),
				}, d => d.s0)
					.Title("d6")
					.Attributes(new { other = "true", path = " d6" })
					.Transition("t0", d => d.s0, d => d.s1)
#if NET40Plus
				.Dialog("d7", new
				{
					s0 = new MvcState("r0", "c0", "a0")
							.Title("s0")
							.TrackCrumbTrail(false),
					s1 = new MvcState("r1/{startRowIndex}/{maximumRows}", "c1", "a1")
							.Title("s1")
							.Defaults(new { startRowIndex = typeof(int), maximumRows = typeof(int), start = typeof(int), size = typeof(int), total = typeof(int) })
							.Defaults(new { startRowIndex = 0, maximumRows = 10 })
							.Derived("totalRowCount")
							.TrackCrumbTrail(false),
					s2 = new MvcState("r2", "c2", "a2")
							.Title("s2"),
					s3 = new WebFormsState("r3", "~/d0/s3.aspx")
							.Title("s3")
				}, d => d.s0)
					.Title("d7")
					.Attributes(new { path = "d7" })
					.Transition("t0", d => d.s0, d => d.s1)
					.Transition("t0", d => d.s1, d => d.s2)
					.Transition("t0", d => d.s2, d => d.s3)
				.Dialog("d8", new
				{
					s0 = new WebApiState("w0", "c0", "a0")
							.Title("s0")
							.TrackCrumbTrail(false),
					s1 = new WebApiState("w1/{startRowIndex}/{maximumRows}", "c1", "a1")
							.Title("s1")
							.Defaults(new { start = typeof(int), size = typeof(int), total = typeof(int) })
							.Defaults(new { startRowIndex = 0, maximumRows = 10 })
							.Derived("totalRowCount")
							.TrackCrumbTrail(false),
					s2 = new WebApiState("w2", "c2", "a2")
							.Title("s2"),
					s3 = new WebFormsState("w3", "~/d0/s3.aspx")
							.Title("s3")
				}, d => d.s0)
					.Title("d8")
					.Path("d8")
					.Transition("t0", d => d.s0, d => d.s1)
					.Transition("t0", d => d.s1, d => d.s2)
					.Transition("t0", d => d.s2, d => d.s3)
#endif
				.Build();
		}
	}
}
