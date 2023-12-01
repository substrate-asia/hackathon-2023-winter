using UnityEngine;

namespace Assets.Scripts
{
    internal class HistoryScreen : ScreenBaseState
    {
        public HistoryScreen(FlowController flowController) : base(flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");
        }
    }
}