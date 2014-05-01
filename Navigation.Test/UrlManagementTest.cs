using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Web;

namespace Navigation.Test
{
	[TestClass]
	public class UrlManagementTest
	{
		public UrlManagementTest()
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

		[TestMethod]
		public void ChecksumDialogTest()
		{
			string url = StateController.GetNavigationLink("d0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
#if NET35Plus
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length= 8 }.Decode(coll, false));
#else
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length= 8 }.Decode(coll));
#endif
		}

		[TestMethod]
		public void ChecksumTransitionTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
#if NET35Plus
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll, false));
#else
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll));
#endif
		}

		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void ChecksumDialogInvalidTest()
		{
			string url = StateController.GetNavigationLink("d0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			coll["c0"] = "0-1";
#if NET35Plus
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll, false));
#else
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll));
#endif
		}

		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void ChecksumTransitionInvalidTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			coll["cs"] = coll["cs"].Substring(0, 7);
#if NET35Plus
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll, false));
#else
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll));
#endif
		}

		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void ChecksumInvalidKeyTest()
		{
			NameValueCollection coll = new NameValueCollection(){{null,""}};
#if NET35Plus
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll, false));
#else
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll));
#endif
		}

#if NET35Plus
		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void NavigateHistoryChecksumInvalidTest()
		{
			StateController.Navigate("d1");
			NameValueCollection coll = new NameValueCollection(){
		        {"name","test"}
		    };
			StateController.NavigateHistory(coll);
		}
#endif

		[TestMethod]
		public void ChecksumNavigateDialogTest()
		{
			string url = StateController.GetNavigationLink("d0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumNavigateDialogRouteTest()
		{
			string url = StateController.GetNavigationLink("d3");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumSkippedNavigateDialogTest()
		{
			string url = StateController.GetNavigationLink("d2");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumSkippedNavigateDialogRouteTest()
		{
			string url = StateController.GetNavigationLink("d5");
#if NET40Plus
			Assert.AreEqual(-1, url.IndexOf("?", StringComparison.Ordinal));
#else
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNull(coll["cs"]);
#endif
		}

		[TestMethod]
		public void ChecksumNavigateTransitionTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumNavigateTransitionRouteTest()
		{
			StateController.Navigate("d3");
			string url = StateController.GetNavigationLink("t0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumSkippedNavigateTransitionTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t1");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumSkippedNavigateTransitionRouteTest()
		{
			StateController.Navigate("d3");
			string url = StateController.GetNavigationLink("t1");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumRefreshTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			string url = StateController.RefreshLink;
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumRefreshRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			string url = StateController.RefreshLink;
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumSkippedRefreshTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t1");
			string url = StateController.RefreshLink;
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumSkippedRefreshRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t1");
			string url = StateController.RefreshLink;
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumNavigateBackTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			string url = StateController.GetNavigationBackLink(1);
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumNavigateBackRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t0");
			StateController.Navigate("t0");
			string url = StateController.GetNavigationBackLink(1);
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumSkippedNavigateBackTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t1");
			StateController.Navigate("t0");
			string url = StateController.GetNavigationBackLink(1);
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNull(coll["cs"]);
		}

		[TestMethod]
		public void ChecksumSkippedNavigateBackRouteTest()
		{
			StateController.Navigate("d3");
			StateController.Navigate("t1");
			StateController.Navigate("t0");
			string url = StateController.GetNavigationBackLink(1);
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNull(coll["cs"]);
		}

		[TestMethod]
		[ExpectedException(typeof(ConfigurationErrorsException))]
		public void NavigationSettingsReadOnlyTest()
		{
			NavigationSettings.Config.StateIdKey = "StateId";
		}
	}
}
