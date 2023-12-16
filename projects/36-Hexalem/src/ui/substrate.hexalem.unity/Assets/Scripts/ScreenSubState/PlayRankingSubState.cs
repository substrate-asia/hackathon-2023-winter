using Assets.Scripts.ScreenStates;
using Substrate.Integration.Helper;
using System;
using System.Linq;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayRankingSubState : ScreenBaseState
    {
        public PlayScreenState PlayScreenState => ParentState as PlayScreenState;

        private VisualElement _bottomBound;
        private VisualElement _bootomPadding;

        private Label _lblActionInfo;

        public PlayRankingSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            _bottomBound = FlowController.VelContainer.Q<VisualElement>("BottomBound");
            _bootomPadding = FlowController.VelContainer.Q<VisualElement>("BottomPadding");
            _bootomPadding.Clear();

            _bottomBound.style.height = 200;
            _bootomPadding.style.height = 200;

            var bodyPadding = FlowController.VelContainer.Q<VisualElement>("BodyPadding");

            TemplateContainer frameInstance = ElementInstance("UI/Frames/RankingFrame");

            bodyPadding.Add(frameInstance);

            TemplateContainer elementInstance = ElementInstance("UI/Elements/BottomWaitingElement");

            _lblActionInfo = elementInstance.Q<Label>("LblActionInfo");

            // add element
            _bootomPadding.Add(elementInstance);
            // avoid raycast through bottom bound UI
            Grid.RegisterBottomBound();

        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            _bottomBound.style.height = 600;
            _bootomPadding.style.height = 600;
        }

    }
}