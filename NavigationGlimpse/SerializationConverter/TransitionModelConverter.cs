using Glimpse.Core.Extensibility;
using Navigation.Glimpse.Model;

namespace Navigation.Glimpse.SerializationConverter
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