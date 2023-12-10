using Assets.Scripts.ScreenStates;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayViewSubState : ScreenBaseState
    {
        public PlayScreenState MainScreenState => ParentState as PlayScreenState;

        public PlayViewSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.Clear();


            TemplateContainer elementInstance = ElementInstance("UI/Frames/PlayViewFrame");

            // add element
            floatBody.Add(elementInstance);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");
        }

    }
}