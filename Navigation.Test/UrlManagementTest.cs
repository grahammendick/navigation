using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web;
using System.Collections.Specialized;

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
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length= 8 }.Decode(coll, false));
		}

		[TestMethod]
		public void ChecksumTransitionTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll, false));
		}

		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void ChecksumDialogInvalidTest()
		{
			string url = StateController.GetNavigationLink("d0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			coll["c0"] = "0-1";
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll, false));
		}

		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void ChecksumTransitionInvalidTest()
		{
			StateController.Navigate("d0");
			string url = StateController.GetNavigationLink("t0");
			NameValueCollection coll = HttpUtility.ParseQueryString(url.Substring(url.IndexOf("?", StringComparison.Ordinal)));
			coll["cs"] = coll["cs"].Substring(0, 7);
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll, false));
		}

		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void ChecksumInvalidKeyTest()
		{
			NameValueCollection coll = new NameValueCollection(){{null,""}};
			Assert.IsNotNull(new ChecksumNavigationShield() { Key = "checksumkey", Length = 8 }.Decode(coll, false));
		}

		[TestMethod]
		[ExpectedException(typeof(UrlException))]
		public void NavigateHistoryChecksumInvalidTest()
		{
			NameValueCollection coll = new NameValueCollection(){
		        {"name","test"}
		    };
			StateController.NavigateHistory(coll);
		}
	}
}
