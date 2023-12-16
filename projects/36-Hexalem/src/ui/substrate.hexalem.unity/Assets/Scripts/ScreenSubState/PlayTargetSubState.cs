using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using System.Linq;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayTargetSubState : ScreenBaseState
    {
        public PlayScreenState PlayScreenState => ParentState as PlayScreenState;

        private VisualTreeAsset _playerScoreElement;

        private VisualElement _bodyPadding;
        private VisualElement _bottomBound;
        private VisualElement _bootomPadding;
        private VisualElement _velCancelBox;

        private ScrollView _scvPlayerScores;

        private Label _lblActionInfo;

        public PlayTargetSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent)
        {
            _playerScoreElement = Resources.Load<VisualTreeAsset>($"UI/Elements/PlayerScoreElement");
        }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            _bottomBound = FlowController.VelContainer.Q<VisualElement>("BottomBound");
            _bootomPadding = FlowController.VelContainer.Q<VisualElement>("BottomPadding");
            _bootomPadding.Clear();

            _bottomBound.style.height = 200;
            _bootomPadding.style.height = 200;

            _bodyPadding = FlowController.VelContainer.Q<VisualElement>("BodyPadding");
            _bodyPadding.style.backgroundColor = new StyleColor(new Color32(255, 255, 255, 255));

            TemplateContainer frameInstance = ElementInstance("UI/Frames/TargetFrame");
            _velCancelBox = frameInstance.Q<VisualElement>("VelCancelBox");
            _velCancelBox.RegisterCallback<ClickEvent>(OnCancelClicked);
            _scvPlayerScores = frameInstance.Q<ScrollView>("ScVPlayerScores");

            _bodyPadding.Add(frameInstance);

            TemplateContainer elementInstance = ElementInstance("UI/Elements/BottomWaitingElement");
            _lblActionInfo = elementInstance.Q<Label>("LblActionInfo");

            // add element
            _bootomPadding.Add(elementInstance);
            // avoid raycast through bottom bound UI
            Grid.RegisterBottomBound();

            OnStorageUpdated(0);

            Storage.OnStorageUpdated += OnStorageUpdated;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            Storage.OnStorageUpdated -= OnStorageUpdated;

            _bodyPadding.style.backgroundColor = new StyleColor(new Color32(255, 255, 255, 0));
            _bodyPadding.Clear();

            _bottomBound.style.height = 600;
            _bootomPadding.style.height = 600;
        }

        private void OnCancelClicked(ClickEvent evt)
        {
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        private void OnStorageUpdated(uint blocknumber)
        {
            _scvPlayerScores.Clear();

            if (Storage.HexaGame == null)
            {
                return;
            }

        }
    }
}