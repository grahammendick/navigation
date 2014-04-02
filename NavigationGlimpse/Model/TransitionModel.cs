using Navigation;

namespace NavigationGlimpse.Model
{
	public class TransitionModel
	{
		public TransitionModel(Transition trans)
        {
            A = 2 * trans.To.Index;
            B = 2 * trans.Parent.Index + 1;
            if (trans.Parent.Index < trans.To.Index)
            {
                A = 2 * trans.Parent.Index + 1;
                B = 2 * trans.To.Index;
            }
            if (trans.Parent.Index > trans.To.Index)
            {
                A = 2 * trans.To.Index + 1;
                B = 2 * trans.Parent.Index;
            }
            Transition = trans;
        }

        public Transition Transition { get; private set; }

        internal int A { get; set; }

        internal int B { get; set; }

        internal int Depth { get; set; }

        public int? X1 { get; set; }

        public int? X2 { get; set; }

        public int Y { get; set; }

        public int H { get; set; }

        internal State From
        {
            get
            {
                return Transition.Parent;
            }
        }

        internal State To
        {
            get
            {
                return Transition.To;
            }
        }

        internal void SetCoords(State state, int value)
        {
            if (From == state && !X1.HasValue)
                X1 = value;
            else
                X2 = value;
        }
    }
}
