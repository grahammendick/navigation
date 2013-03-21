using System.Web;
using System.Web.ModelBinding;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Navigation.Test
{
	[TestClass]
	public class NavigationDataBindingTest
	{
		public NavigationDataBindingTest()
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
		public void NavigationDataValueProviderTest()
		{
			NavigationData data = new NavigationData() { 
				{ "string", "Hello" }, {"int", 1 }
			};
			StateController.Navigate("d0", data);
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, false, null);
			Assert.AreEqual("Hello", provider.GetValue("string").RawValue);
			Assert.AreEqual(1, provider.GetValue("int").RawValue);
			Assert.AreEqual("1", provider.GetValue("int").AttemptedValue);
		}

		[TestMethod]
		public void BlankDataValueProviderTest()
		{
			StateController.Navigate("d0");
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, false, null);
			Assert.IsNull(provider.GetValue("string"));
		}

		[TestMethod]
		public void BlankKeyValueProviderTest()
		{
			StateController.Navigate("d0");
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, false, null);
			Assert.IsNull(provider.GetValue(""));
		}

		[TestMethod]
		public void DefaultPropertyControlDataValueProviderTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Bag.i = 1;
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			Page page = new Page();
			TextBox textBox = new TextBox();
			textBox.ID = "textBox";
			textBox.Text = "i";
			page.Controls.Add(textBox);
			context.PublishService<Control>(page);
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, true, null);
			Assert.AreEqual(1, provider.GetValue("textBox").RawValue);
		}

		[TestMethod]
		public void CustomPropertyControlDataValueProviderTest()
		{
			StateController.Navigate("d0");
			StateContext.Data["double"] = 5d;
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			Page page = new Page();
			TextBox textBox = new TextBox();
			textBox.ID = "textBox";
			textBox.CssClass = "double";
			page.Controls.Add(textBox);
			context.PublishService<Control>(page);
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, true, "CssClass");
			Assert.AreEqual(5d, provider.GetValue("textBox").RawValue);
		}

		[TestMethod]
		[ExpectedException(typeof(HttpException))]
		public void InvalidPropertyControlDataValueProviderTest()
		{
			StateController.Navigate("d0");
			StateContext.Bag.i = 1;
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			Page page = new Page();
			TextBox textBox = new TextBox();
			textBox.ID = "textBox";
			textBox.Text = "i";
			page.Controls.Add(textBox);
			context.PublishService<Control>(page);
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, true, "Invalid");
			provider.GetValue("textBox");
		}

		[TestMethod]
		public void PropertyControlObjectDataValueProviderTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Data["10"] = 3;
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			Page page = new Page();
			TextBox textBox = new TextBox();
			textBox.ID = "textBox";
			textBox.Columns = 10;
			page.Controls.Add(textBox);
			context.PublishService<Control>(page);
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, true, "Columns");
			Assert.AreEqual(3, provider.GetValue("textBox").RawValue);
		}

		[TestMethod]
		public void BlankDefaultPropertyControlDataValueProviderTest()
		{
			StateController.Navigate("d0");
			StateContext.Bag.i = 1;
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			Page page = new Page();
			TextBox textBox = new TextBox();
			textBox.ID = "textBox";
			page.Controls.Add(textBox);
			context.PublishService<Control>(page);
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, true, null);
			Assert.IsNull(provider.GetValue("textBox"));
		}

		[TestMethod]
		public void BlankCustomPropertyControlDataValueProviderTest()
		{
			StateController.Navigate("d0");
			StateController.Navigate("t0");
			StateContext.Data["i"] = 1;
			ModelBindingExecutionContext context = new ModelBindingExecutionContext(new MockHttpContext(), new ModelStateDictionary());
			Page page = new Page();
			TextBox textBox = new TextBox();
			textBox.ID = "textBox";
			textBox.Text = "i";
			page.Controls.Add(textBox);
			context.PublishService<Control>(page);
			NavigationDataValueProvider provider = new NavigationDataValueProvider(context, true, "CssClass");
			Assert.IsNull(provider.GetValue("textBox"));
		}
	}
}
