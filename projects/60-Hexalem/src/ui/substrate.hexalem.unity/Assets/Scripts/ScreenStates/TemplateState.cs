using UnityEngine;

namespace Assets.Scripts.ScreenStates
{
    public class TemplateState : ScreenBaseState
    {
        public TemplateState(FlowController _flowController)
            : base(_flowController) { }

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