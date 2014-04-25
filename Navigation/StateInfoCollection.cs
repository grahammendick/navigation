using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Runtime.Serialization;

namespace Navigation
{
	/// <summary>
	/// Represents a strongly typed collection of the items configurable via the Navigation/StateInfo
	/// section. The <see cref="Navigation.StateInfoConfig"/> class holds all these in 
	/// its <see cref="Navigation.StateInfoConfig.Dialogs"/> property
	/// </summary>
	/// <typeparam name="T">Can be <see cref="Navigation.Dialog"/>, <see cref="Navigation.State"/> 
	/// or <see cref="Navigation.Transition"/> type</typeparam>
	[Serializable]
	public class StateInfoCollection<T> : NameObjectCollectionBase, IEnumerable<T>
	{
		internal StateInfoCollection() : base()
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="Navigation.StateInfoCollection{T}"/> class with 
		/// serialized data
		/// </summary>
		/// <param name="info">The object that holds the serialized object data</param>
		/// <param name="context">The contextual information about the source or destination</param>
		protected StateInfoCollection(SerializationInfo info, StreamingContext context)
			: base(info, context)
		{
		}

		internal void Add(string key, T value)
		{
			this.BaseAdd(key, value);
		}

		/// <summary>
		/// Gets the unique state information configuration item with the specified <paramref name="key"/>,
		/// see <see cref="Navigation.Dialog.Key">Dialog Key</see>, <see cref="Navigation.State.Key">State Key</see>
		/// and <see cref="Navigation.Transition.Key">Transition Key</see> properties
		/// </summary>
		/// <param name="key">Must match the key attribute of an item configurable via 
		/// the Navigation/StateInfo</param>
		/// <returns>Matching state information configuration item, if found; otherwise, null</returns>
		public T Get(string key)
		{
			return (T)this.BaseGet(key);
		}

		/// <summary>
		/// Gets the unique state information configuration item with the specified <paramref name="index"/>,
		/// see <see cref="Navigation.Dialog.Index">Dialog Index</see>, <see cref="Navigation.State.Index">State Index</see>
		/// and <see cref="Navigation.Transition.Index">Transition Index</see> properties
		/// </summary>
		/// <param name="index">Must match the number of the configurable item from the Navigation/StateInfo 
		/// as read sequentially within its parent node</param>
		/// <returns>Matching state information configuration item, if found; otherwise, null</returns>
		public T Get(int index)
		{
			return (T) this.BaseGet(index);
		}

		/// <summary>
		/// Gets the unique state information configuration item with the specified <paramref name="key"/>,
		/// see <see cref="Navigation.Dialog.Key">Dialog Key</see>, <see cref="Navigation.State.Key">State Key</see>
		/// and <see cref="Navigation.Transition.Key">Transition Key</see> properties
		/// </summary>
		/// <param name="key">Must match the key attribute of an item configurable via 
		/// the Navigation/StateInfo</param>
		/// <returns>Matching state information configuration item, if found; otherwise, null</returns>
		public T this[string key]
		{
			get
			{
				return this.Get(key);
			}
			internal set
			{
				this.BaseSet(key, value);
			}
		}

		/// <summary>
		/// Gets the unique state information configuration item with the specified <paramref name="index"/>,
		/// see <see cref="Navigation.Dialog.Index">Dialog Index</see>, <see cref="Navigation.State.Index">State Index</see>
		/// and <see cref="Navigation.Transition.Index">Transition Index</see> properties
		/// </summary>
		/// <param name="index">Must match the number of the configurable item from the Navigation/StateInfo 
		/// as read sequentially within its parent node</param>
		/// <returns>Matching state information configuration item, if found; otherwise, null</returns>
		public T this[int index]
		{
			get
			{
				return this.Get(index);
			}
			internal set
			{
				this.BaseSet(index, value);
			}
		}

		/// <summary>
		/// Copies the <see cref="Navigation.StateInfoCollection{T}"/> entries to a one-dimensional Array 
		/// instance at the specified index
		/// </summary>
		/// <param name="array">The one-dimensional <see cref="System.Array"/> that is the destination of 
		/// the state information configuration objects copied from <see cref="Navigation.StateInfoCollection{T}"/>.
		/// The <see cref="System.Array"/> must have zero-based indexing</param>
		/// <param name="index">The zero-based index in <paramref name="array"/> at which copying begins</param>
		/// <exception cref="System.ArgumentNullException"><paramref name="array"/> is null</exception>
		/// <exception cref="System.ArgumentOutOfRangeException"><paramref name="index"/> is less than zero</exception>
		/// <exception cref="System.ArgumentException"><paramref name="array"/> is multidimensional; or <paramref name="index"/>
		/// is equal to or greater than the length of <paramref name="array"/>; or the number of elements in the source
		/// <see cref="Navigation.StateInfoCollection{T}"/> is greater than the available space from <paramref name="index"/>
		/// to the end of the destination array</exception>
		public void CopyTo(T[] array, int index)
		{
			((ICollection)this).CopyTo(array, index);
		}

		/// <summary>
		/// Returns an <see cref="System.Collections.IEnumerator"/> that iterates through
		/// the <see cref="Navigation.StateInfoCollection{T}"/> elements
		/// </summary>
		/// <returns>An <see cref="System.Collections.IEnumerator"/> for
		/// the <see cref="Navigation.StateInfoCollection{T}"/></returns>
		public override IEnumerator GetEnumerator()
		{
			foreach (string key in this.Keys)
				yield return this[key];
		}

		IEnumerator<T> IEnumerable<T>.GetEnumerator()
		{
			foreach (T item in (IEnumerable)this)
				yield return item;
		}
	}
}
