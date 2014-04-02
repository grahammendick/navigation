using Glimpse.Core.Extensibility;
using NavigationGlimpse.Model;

namespace NavigationGlimpse.SerializationConverter
{
	public class TransitionModelConverter : SerializationConverter<TransitionModel>
	{
		public override object Convert(TransitionModel transModel)
		{
			return new
			{
				transModel.Transition.Key,
				transModel.X1,
				transModel.X2,
				transModel.Y,
				transModel.H
			};
		}
	}
}