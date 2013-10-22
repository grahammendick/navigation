#if NET45Plus
using System;
using System.Web.ModelBinding;

namespace Navigation
{
	/// <summary>
	/// Represents an attribute that specifies that model binding values are provided
	/// by a <see cref="Navigation.NavigationData"/> value
	/// </summary>
	[AttributeUsage(AttributeTargets.Parameter, Inherited = false, AllowMultiple = false)]
	public sealed class NavigationDataAttribute : ValueProviderSourceAttribute
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationDataAttribute"/>
		/// class
		/// </summary>
		public NavigationDataAttribute()
			: this(null)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationDataAttribute"/>
		/// class using the specified <see cref="Navigation.NavigationData"/> key
		/// </summary>
		/// <param name="key">The <see cref="Navigation.NavigationData"/> key</param>
		public NavigationDataAttribute(string key)
			: this(false, key)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationDataAttribute"/>
		/// class specifying whether the <see cref="Navigation.NavigationData"/> key will be
		/// retrieved from a <see cref="System.Web.UI.Control"/>, for scenarios where the key 
		/// is only known at runtime
		/// </summary>
		/// <param name="control">Indicates whether the <see cref="Navigation.NavigationData"/> 
		/// key will be retrieved from a <see cref="System.Web.UI.Control"/></param>
		public NavigationDataAttribute(bool control)
			: this(control, null)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationDataAttribute"/>
		/// class specifying whether the <see cref="Navigation.NavigationData"/> key will be
		/// retrieved from a <see cref="System.Web.UI.Control"/>, for scenarios where the key 
		/// is only known at runtime
		/// </summary>
		/// <param name="control">Indicates whether the <see cref="Navigation.NavigationData"/> 
		/// key will be retrieved from a <see cref="System.Web.UI.Control"/></param>
		/// <param name="key"> The <see cref="System.Web.UI.Control"/> ID if <paramref name="control"/>
		/// is true, or the <see cref="Navigation.NavigationData"/> key if <paramref name="control"/>
		/// is false</param>
		public NavigationDataAttribute(bool control, string key)
		{
			Key = key;
			Control = control;
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.NavigationDataAttribute"/>
		/// class where the <see cref="Navigation.NavigationData"/> key will be retrieved from 
		/// a <see cref="System.Web.UI.Control"/> using the specified key and propertyName, for 
		/// scenarios where the key is only known at runtime
		/// </summary>
		/// <param name="key">The <see cref="System.Web.UI.Control"/> ID</param>
		/// <param name="propertyName">The <see cref="System.Web.UI.Control"/> property</param>
		public NavigationDataAttribute(string key, string propertyName)
			: this(true, key)
		{
			PropertyName = propertyName;
		}

		/// <summary>
		/// Gets the <see cref="Navigation.NavigationData"/> key if <see cref="Control"/> is false,
		/// or the <see cref="System.Web.UI.Control"/> ID if <see cref="Control"/> is true
		/// </summary>
		public string Key
		{
			get;
			private set;
		}

		/// <summary>
		/// Gets a value indicating whether the <see cref="Navigation.NavigationData"/> key
		/// will be retrieved from a <see cref="System.Web.UI.Control"/>
		/// </summary>
		public bool Control
		{
			get;
			private set;
		}

		/// <summary>
		/// Gets the name of the <see cref="System.Web.UI.Control"/> property holding the
		/// <see cref="Navigation.NavigationData"/> key
		/// </summary>
		public string PropertyName
		{
			get;
			private set;
		}

		/// <summary>
		/// Returns the name of the model
		/// </summary>
		/// <returns>The name of the model</returns>
		public override string GetModelName()
		{
			return Key;
		}

		/// <summary>
		/// Returns the value provider
		/// </summary>
		/// <param name="modelBindingExecutionContext">The execution context</param>
		/// <returns>The value provider</returns>
		/// <exception cref="System.ArgumentNullException">The modelBindingExecutionContext 
		/// parameter is null</exception>
		public override IValueProvider GetValueProvider(ModelBindingExecutionContext modelBindingExecutionContext)
		{
			if (modelBindingExecutionContext == null)
			{
				throw new ArgumentNullException("modelBindingExecutionContext");
			}
			return new NavigationDataValueProvider(modelBindingExecutionContext, Control, PropertyName);
		}
	}
}
#endif