using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections;
using System.Configuration;
using System.Collections.Specialized;
using System.Web;

namespace Navigation.Test
{
	[TestClass]
	public class NavigationDataTest
	{
		public NavigationDataTest()
		{
		}

		private TestContext testContextInstance;

		public TestContext TestContext
		{
			get
			{
				return testContextInstance;
			}
			set
			{
				testContextInstance = value;
			}
		}

		private NavigationData _IndividualNavigationData;
		private NavigationData IndividualNavigationData
		{
			get
			{
				if (_IndividualNavigationData == null)
				{
					_IndividualNavigationData = new NavigationData();
					_IndividualNavigationData["string"] = "Hello";
					_IndividualNavigationData["bool"] = true;
					_IndividualNavigationData["short"] = (short)1;
					_IndividualNavigationData["long"] = (long)2;
					_IndividualNavigationData["float"] = (float)3;
					_IndividualNavigationData["double"] = (double)4;
					_IndividualNavigationData["decimal"] = (decimal)5;
					_IndividualNavigationData["DateTime"] = new DateTime(1990, 3, 1, 12, 35, 47);
					_IndividualNavigationData["TimeSpan"] = new TimeSpan(10, 5, 23);
					_IndividualNavigationData["byte"] = (byte)6;
					_IndividualNavigationData["char"] = (char)7;
					_IndividualNavigationData["Guid"] = Guid.Empty;
					_IndividualNavigationData["customData"] = new CustomData() { Name = "Bob", Age = 18 };
					_IndividualNavigationData["custom2Data"] = new Custom2Data() { Name = "Bob", Age = 18 };
					_IndividualNavigationData["dayOfWeek"] = DayOfWeek.Saturday;
				}
				return _IndividualNavigationData;
			}
		}

		private NavigationData _ListNavigationData;
		private NavigationData ListNavigationData
		{
			get
			{
				if (_ListNavigationData == null)
				{
					_ListNavigationData = new NavigationData();
					_ListNavigationData["List<string>"] = new List<string> { "Hello", "World" };
					_ListNavigationData["List<bool>"] = new List<bool> { true, false };
					_ListNavigationData["List<short>"] = new List<short> { 1, 2 };
					_ListNavigationData["List<long>"] = new List<long> { 2, 3 };
					_ListNavigationData["List<float>"] = new List<float> { 3, 4 };
					_ListNavigationData["List<double>"] = new List<double> { 4, 5 };
					_ListNavigationData["List<decimal>"] = new List<decimal> { 5, 6 };
					_ListNavigationData["List<DateTime>"] = new List<DateTime>() { new DateTime(1990, 3, 1, 12, 35, 47), new DateTime(1971, 10, 5, 11, 1, 15) };
					_ListNavigationData["List<TimeSpan>"] = new List<TimeSpan>() { new TimeSpan(10, 5, 23), new TimeSpan(8, 7, 6) };
					_ListNavigationData["List<byte>"] = new List<byte>() { 6, 7 };
					_ListNavigationData["List<char>"] = new List<char>() { '7', '8' };
					_ListNavigationData["List<Guid>"] = new List<Guid>() { Guid.Empty, Guid.Empty };
					_ListNavigationData["List<customData>"] = new List<CustomData>() { new CustomData() { Name = "Bob", Age = 18 }, new CustomData() { Name = "Jane", Age = 20 } };
					_ListNavigationData["List<custom2Data>"] = new List<Custom2Data>() { new Custom2Data() { Name = "Bob", Age = 18 }, new Custom2Data() { Name = "Jane", Age = 20 } };
					_ListNavigationData["List<dayOfWeek>"] = new List<DayOfWeek>() { DayOfWeek.Saturday, DayOfWeek.Monday };
				}
				return _ListNavigationData;
			}
		}

		private NavigationData _ArrayListNavigationData;
		private NavigationData ArrayListNavigationData
		{
			get
			{
				if (_ArrayListNavigationData == null)
				{
					_ArrayListNavigationData = new NavigationData();
					_ArrayListNavigationData["ArrayList(string)>"] = new ArrayList() { null, "World" };
					_ArrayListNavigationData["ArrayList(bool)"] = new ArrayList() { true, false };
					_ArrayListNavigationData["ArrayList(short)"] = new ArrayList() { 1, 2 };
					_ArrayListNavigationData["ArrayList(long)"] = new ArrayList() { 2, 3 };
					_ArrayListNavigationData["ArrayList(float)"] = new ArrayList() { 3, 4 };
					_ArrayListNavigationData["ArrayList(double)"] = new ArrayList() { 4, 5 };
					_ArrayListNavigationData["ArrayList(decimal)"] = new ArrayList() { 5, 6 };
					_ArrayListNavigationData["ArrayList(DateTime)"] = new ArrayList() { new DateTime(1990, 3, 1, 12, 35, 47), new DateTime(1971, 10, 5, 11, 1, 15) };
					_ArrayListNavigationData["ArrayList(TimeSpan)"] = new ArrayList() { new TimeSpan(10, 5, 23), new TimeSpan(8, 7, 6) };
					_ArrayListNavigationData["ArrayList(byte)"] = new ArrayList() { 6, 7 };
					_ArrayListNavigationData["ArrayList(char)"] = new ArrayList() { '7', '8' };
					_ArrayListNavigationData["ArrayList(Guid)"] = new ArrayList() { Guid.Empty, Guid.Empty };
					_ArrayListNavigationData["ArrayList(customData)"] = new ArrayList() { new CustomData() { Name = "Bob", Age = 18 }, new CustomData() { Name = "Jane", Age = 20 } };
					_ArrayListNavigationData["ArrayList(custom2Data)"] = new ArrayList() { new Custom2Data() { Name = "Bob", Age = 18 }, new Custom2Data() { Name = "Jane", Age = 20 } };
					_ArrayListNavigationData["ArrayList(dayOfWeek)"] = new ArrayList() { DayOfWeek.Saturday, DayOfWeek.Monday };
				}
				return _ArrayListNavigationData;
			}
		}

		[TestMethod]
		public void NavigateIndividualDataTest()
		{
			StateController.Navigate("d0", IndividualNavigationData);
			int i = 0;
			foreach (NavigationDataItem item in StateContext.Data)
			{
				Assert.AreEqual(IndividualNavigationData[item.Key], item.Value);
				i++;
			}
			Assert.AreEqual(15, i);
		}

		[TestMethod]
		public void NavigateIndividualDataWithoutTrailTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			StateController.Navigate("t0", IndividualNavigationData);
			int i = 0;
			foreach (NavigationDataItem item in StateContext.Data)
			{
				Assert.AreEqual(IndividualNavigationData[item.Key], item.Value);
				i++;
			}
			Assert.AreEqual(15, i);
		}

		[TestMethod]
		public void NavigateListDataTest()
		{
			StateController.Navigate("d0", ListNavigationData);
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			int i = 0;
			foreach (NavigationDataItem item in (IEnumerable)StateContext.Data)
			{
				Assert.AreEqual(((IList)ListNavigationData[item.Key])[0], ((IList)item.Value)[0]);
				Assert.AreEqual(((IList)ListNavigationData[item.Key])[1], ((IList)item.Value)[1]);
				i++;
			}
			Assert.AreEqual(15, i);
		}

		[TestMethod]
		public void NavigateArrayListDataTest()
		{
			StateController.Navigate("d0", ArrayListNavigationData);
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			int i = 0;
			foreach (NavigationDataItem item in StateContext.Data)
			{
				Assert.AreEqual(((IList)ArrayListNavigationData[item.Key])[0], ((IList)item.Value)[0]);
				Assert.AreEqual(((IList)ArrayListNavigationData[item.Key])[1], ((IList)item.Value)[1]);
				i++;
			}
			Assert.AreEqual(15, i);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidIndividualDataTest()
		{
			NavigationData data = new NavigationData();
			data["item"] = DateTimeOffset.MinValue;
			StateController.Navigate("d0", data);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidListDataTest()
		{
			StateController.Navigate("d0");
			StateContext.Data["item"] = new List<DateTimeKind>() { DateTimeKind.Local };
			StateController.Navigate("t0");
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidListTest()
		{
			NavigationData data = new NavigationData();
			data["item"] = new HashSet<string>() { "1" };
			StateController.Navigate("d0", data);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidArrayListDataTest()
		{
			StateController.Navigate("d0");
			StateContext.Data["item"] = new ArrayList() { DateTimeKind.Local };
			StateController.Navigate("t0");
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidDataGetNavigationLinkTest()
		{
			NavigationData data = new NavigationData();
			data["item"] = DateTimeOffset.MinValue;
			string link = StateController.GetNavigationLink("d0", data);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidDataRefreshTest()
		{
			StateController.Navigate("d0");
			StateContext.Data["item"] = DateTimeOffset.MinValue;
			StateController.Refresh(new NavigationData(true));
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidRefreshDataTest()
		{
			StateController.Navigate("d0");
			StateController.Refresh(new NavigationData() { { "item", DateTimeOffset.MinValue } });
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidDataGetRefreshLinkTest()
		{
			StateController.Navigate("d0");
			StateContext.Data["item"] = DateTimeOffset.MinValue;
			string link = StateController.GetRefreshLink(new NavigationData(true));
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void InvalidGetRefreshLinkDataTest()
		{
			StateController.Navigate("d0");
			string link = StateController.GetRefreshLink(new NavigationData() { { "item", DateTimeOffset.MinValue } });
		}

		[TestMethod]
		public void InvalidTypesArrayListDataTest()
		{
			NavigationData data = new NavigationData();
			data["item0"] = new ArrayList() { "0", 1 };
			data["item1"] = new ArrayList() { 0, "1" };
			StateController.Navigate("d0", data);
			Assert.AreEqual(((ArrayList)StateContext.Data["item0"])[0], "0");
			Assert.AreEqual(((ArrayList)StateContext.Data["item0"])[1], "1");
			Assert.AreEqual(((ArrayList)StateContext.Data["item1"])[0], 0);
			Assert.AreEqual(((ArrayList)StateContext.Data["item1"])[1], 1);
		}

		[TestMethod]
		public void NavigateInvalidContextDataWithoutTrailTest()
		{
			StateController.Navigate("d2");
			StateController.Navigate("t0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateContext.Data["item"] = DateTimeOffset.MinValue;
			StateController.Navigate("t0", data);
			Assert.AreEqual("Hello", StateContext.Data["s"]);
		}

		[TestMethod]
		public void RefreshInvalidContextDataTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateContext.Data["item"] = DateTimeOffset.MinValue;
			StateController.Refresh(data);
			Assert.AreEqual("Hello", StateContext.Data["s"]);
		}

		[TestMethod]
		[ExpectedException(typeof(ArgumentException))]
		public void NavigateInvalidDataWithoutTrailTest()
		{
			NavigationData data = new NavigationData();
			data["item"] = DateTimeOffset.MinValue;
			StateController.Navigate("d2", data);
		}

		[TestMethod]
		public void ReservedUrlCharacterDataTest()
		{
			NavigationData data = new NavigationData();
			data["*()-_+~@:?><.;[]{}!£$%^&"] = "!£$%^&*()-_+~@:?><.;[]{}";
			StateController.Navigate("d0", data);
			StateController.Navigate("t0");
			StateController.NavigateBack(1);
			Assert.AreEqual("!£$%^&*()-_+~@:?><.;[]{}", data["*()-_+~@:?><.;[]{}!£$%^&"]);
		}

		[TestMethod]
		public void NavigateDataNavigateBackTest()
		{
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("d0", data);
			StateController.Navigate("t0");
			Assert.AreEqual("Hello", StateController.Crumbs[0].Data["s"]);
			StateController.NavigateBack(1);
			Assert.AreEqual("Hello", StateContext.Data["s"]);
		}

		[TestMethod]
		public void ChangeDataNavigateBackTest()
		{
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("d0", data);
			StateContext.Data["s"] = "World";
			StateContext.Data["i"] = 2;
			StateController.Navigate("t0");
			Assert.AreEqual("World", StateController.Crumbs[0].Data["s"]);
			Assert.AreEqual(2, StateController.Crumbs[0].Data["i"]);
			StateController.NavigateBack(1);
			Assert.AreEqual("World", StateContext.Data["s"]);
			Assert.AreEqual(2, StateContext.Data["i"]);
		}

		[TestMethod]
		public void BlankDataNavigateBackTest()
		{
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("d0", data);
			StateContext.Data["s"] = null;
			StateContext.Data["i"] = 2;
			StateController.Navigate("t0");
			Assert.IsNull(StateController.Crumbs[0].Data["s"]);
			Assert.AreEqual(2, StateController.Crumbs[0].Data["i"]);
			StateController.NavigateBack(1);
			Assert.AreEqual(null, StateContext.Data["s"]);
			Assert.AreEqual(2, StateContext.Data["i"]);
		}

		[TestMethod]
		public void ClearDataNavigateBackTest()
		{
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("d0", data);
			StateContext.Data.Clear();
			StateController.Navigate("t0");
			Assert.IsNull(StateController.Crumbs[0].Data["s"]);
			Assert.IsNull(StateController.Crumbs[0].Data["i"]);
			StateController.NavigateBack(1);
			Assert.AreEqual(null, StateContext.Data["s"]);
			Assert.AreEqual(null, StateContext.Data["i"]);
		}

		[TestMethod]
		public void RemoveDataNavigateBackTest()
		{
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("d0", data);
			StateContext.Data.Remove("s");
			StateContext.Data["i"] = 2;
			StateController.Navigate("t0");
			Assert.IsNull(StateController.Crumbs[0].Data["s"]);
			Assert.AreEqual(2, StateController.Crumbs[0].Data["i"]);
			StateController.NavigateBack(1);
			Assert.IsNull(StateContext.Data["s"]);
			Assert.AreEqual(2, StateContext.Data["i"]);
		}

		[TestMethod]
		public void NavigateDataRefreshTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("t0", data);
			StateController.Refresh(new NavigationData(true));
			Assert.AreEqual("Hello", StateContext.Data["s"]);
		}

		[TestMethod]
		public void NavigateRefreshDataTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("t0");
			StateController.Refresh(data);
			Assert.AreEqual("Hello", StateContext.Data["s"]);
		}

		[TestMethod]
		public void NavigateDataRefreshDataOverrideTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("t0", data);
			data = new NavigationData();
			data["s"] = "World";
			StateController.Refresh(data);
			Assert.AreEqual("World", StateContext.Data["s"]);
		}

		[TestMethod]
		public void NavigateDataRefreshDataBlankTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("t0", data);
			StateController.Refresh();
			Assert.IsNull(StateContext.Data["s"]);
		}

		[TestMethod]
		public void NavigateDataRefreshDataClearTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("t0", data);
			StateContext.Data.Clear();
			StateController.Refresh(new NavigationData(true));
			Assert.IsNull(StateContext.Data["s"]);
		}

		[TestMethod]
		public void ChangeDataRefreshTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("t0", data);
			StateContext.Data["s"] = "World";
			StateContext.Data["d"] = new DateTime(2000, 1, 3);
			StateController.Refresh(new NavigationData(true));
			Assert.AreEqual("World", StateContext.Data["s"]);
			Assert.AreEqual(new DateTime(2000, 1, 3), StateContext.Data["d"]);
		}

		[TestMethod]
		public void ChangeRefreshDataTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			data["i"] = 3;
			StateController.Navigate("t0", data);
			data = new NavigationData();
			data["s"] = "World";
			data["d"] = new DateTime(2000, 1, 3);
			StateController.Refresh(data);
			Assert.AreEqual("World", StateContext.Data["s"]);
			Assert.AreEqual(new DateTime(2000, 1, 3), StateContext.Data["d"]);
			Assert.IsNull(StateContext.Data["i"]);
		}

		[TestMethod]
		public void ChangeDataRefreshDataOverrideTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("t0", data);
			StateContext.Data["s"] = "World";
			StateContext.Data["d"] = new DateTime(2000, 1, 3);
			StateContext.Data["i"] = 3;
			data = new NavigationData(true);
			data["s"] = "Hello World";
			data["i"] = null;
			data["n"] = 2;
			StateController.Refresh(data);
			Assert.AreEqual("Hello World", StateContext.Data["s"]);
			Assert.AreEqual(new DateTime(2000, 1, 3), StateContext.Data["d"]);
			Assert.IsNull(StateContext.Data["i"]);
			Assert.AreEqual(2, StateContext.Data["n"]);
		}

		[TestMethod]
		public void NavigateWizardDataTest()
		{
			StateController.Navigate("d0");
			NavigationData data = new NavigationData(){
				{"s","Hello"},
				{"n",5d}
			};
			StateController.Navigate("t0", data);
			StateController.Navigate("t1", new NavigationData(true));
			Assert.AreEqual("Hello", StateController.Crumbs[1]["s"]);
			Assert.AreEqual(5d, StateController.Crumbs[1]["n"]);
			Assert.AreEqual("Hello", StateContext.Data["s"]);
			Assert.AreEqual(5d, StateContext.Data["n"]);
		}

		[TestMethod]
		public void NavigateDataNavigateTransitionTransitionTest()
		{
			NavigationData data = new NavigationData();
			data["s"] = 1;
			StateController.Navigate("d0", data);
			Assert.AreEqual(1, StateContext.Data["s"]);
			Assert.IsNull(StateContext.Data["t"]);
			data["s"] = 2;
			data["t"] = "2";
			StateController.Navigate("t1", data);
			Assert.AreEqual(1, StateController.Crumbs[0]["s"]);
			Assert.IsNull(StateController.Crumbs[0]["t"]);
			Assert.AreEqual(2, StateContext.Data["s"]);
			Assert.AreEqual("2", StateContext.Data["t"]);
			data["s"] = 3;
			data["t"] = "3";
			StateController.Navigate("t1", data);
			Assert.AreEqual(1, StateController.Crumbs[0].Data["s"]);
			Assert.IsNull(StateController.Crumbs[0].Data["t"]);
			Assert.AreEqual(2, StateController.Crumbs[1].Data["s"]);
			Assert.AreEqual("2", StateController.Crumbs[1].Data["t"]);
			Assert.AreEqual(3, StateContext.Data["s"]);
			Assert.AreEqual("3", StateContext.Data["t"]);
		}

		[TestMethod]
		public void ChangeDataNavigateTransitionTransitionTest()
		{
			NavigationData data = new NavigationData();
			data["s"] = 1;
			StateController.Navigate("d0", data);
			Assert.AreEqual(1, StateContext.Data["s"]);
			StateContext.Data["s"] = 11;
			Assert.IsNull(StateContext.Data["t"]);
			data["s"] = 2;
			data["t"] = "2";
			StateController.Navigate("t1", data);
			Assert.AreEqual(11, StateController.Crumbs[0]["s"]);
			Assert.IsNull(StateController.Crumbs[0]["t"]);
			Assert.AreEqual(2, StateContext.Data["s"]);
			Assert.AreEqual("2", StateContext.Data["t"]);
			StateContext.Data["t"] = "22";
			data["s"] = 3;
			data["t"] = "3";
			StateController.Navigate("t1", data);
			Assert.AreEqual(11, StateController.Crumbs[0].Data["s"]);
			Assert.IsNull(StateController.Crumbs[0].Data["t"]);
			Assert.AreEqual(2, StateController.Crumbs[1].Data["s"]);
			Assert.AreEqual("22", StateController.Crumbs[1].Data["t"]);
			Assert.AreEqual(3, StateContext.Data["s"]);
			Assert.AreEqual("3", StateContext.Data["t"]);
		}

		[TestMethod]
		public void ChangeCrumbDataNavigateBackTest()
		{
			NavigationData data = new NavigationData();
			data["s"] = "Hello";
			StateController.Navigate("d0", data);
			StateController.Navigate("t0");
			Crumb crumb = StateController.Crumbs[0];
			crumb.Data["s"] = "Changed";
			Assert.AreEqual("Changed", crumb.Data["s"]);
			Assert.AreEqual("Hello", StateController.Crumbs[0].Data["s"]);
			StateController.NavigateBack(1);
			Assert.AreEqual("Hello", StateContext.Data["s"]);
		}

		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void NavigateHistoryInvalidDataTest()
		{
			NameValueCollection coll = new NameValueCollection(){
		        {"name","22!1"},
		        {"cs","VLijzPeq"}
		    };
			StateController.NavigateHistory(coll);
		}

		[TestMethod]
		public void NavigateHistoryIndividualDataTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t0", IndividualNavigationData);
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			StateController.NavigateHistory(coll);
			int i = 0;
			foreach (NavigationDataItem item in StateContext.Data)
			{
				Assert.AreEqual(IndividualNavigationData[item.Key], item.Value);
				i++;
			}
			Assert.AreEqual(15, i);
		}

		[TestMethod]
		public void NavigateHistoryListDataTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t0", ListNavigationData);
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			StateController.NavigateHistory(coll);
			int i = 0;
			foreach (NavigationDataItem item in (IEnumerable)StateContext.Data)
			{
				Assert.AreEqual(((IList)ListNavigationData[item.Key])[0], ((IList)item.Value)[0]);
				Assert.AreEqual(((IList)ListNavigationData[item.Key])[1], ((IList)item.Value)[1]);
				i++;
			}
			Assert.AreEqual(15, i);
		}

		[TestMethod]
		public void NavigateHistoryArrayListDataTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t0", ArrayListNavigationData);
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			StateController.NavigateHistory(coll);
			int i = 0;
			foreach (NavigationDataItem item in StateContext.Data)
			{
				Assert.AreEqual(((IList)ArrayListNavigationData[item.Key])[0], ((IList)item.Value)[0]);
				Assert.AreEqual(((IList)ArrayListNavigationData[item.Key])[1], ((IList)item.Value)[1]);
				i++;
			}
			Assert.AreEqual(15, i);
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void EmptyNavigationDataType()
		{
			ConfigurationManager.GetSection("Navigation/EmptyNavigationDataType");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidNavigationDataType()
		{
			ConfigurationManager.GetSection("Navigation/InvalidNavigationDataType");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidConversionFrom()
		{
			ConfigurationManager.GetSection("Navigation/InvalidConversionFrom");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidConversionTo()
		{
			ConfigurationManager.GetSection("Navigation/InvalidConversionTo");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidNavigationDataConverter()
		{
			ConfigurationManager.GetSection("Navigation/InvalidNavigationDataConverter");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidNavigationDataConverterType()
		{
			ConfigurationManager.GetSection("Navigation/InvalidNavigationDataConverterType");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidConversionFromConverter()
		{
			ConfigurationManager.GetSection("Navigation/InvalidConversionFromConverter");
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void InvalidConversionToConverter()
		{
			ConfigurationManager.GetSection("Navigation/InvalidConversionToConverter");
		}
	}
}
