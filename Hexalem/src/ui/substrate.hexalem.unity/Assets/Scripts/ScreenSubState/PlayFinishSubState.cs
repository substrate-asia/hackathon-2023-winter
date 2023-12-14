using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayFinishSubState : ScreenBaseState
    {
        public PlayScreenState MainScreenState => ParentState as PlayScreenState;

        private Button _btnBack;

        private Label _lblActionInfo;
        private Label _lblActionTitle;

        public PlayFinishSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var BootomPadding = FlowController.VelContainer.Q<VisualElement>("BottomPadding");
            BootomPadding.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Elements/BottomFinishElement");

            _btnBack = elementInstance.Q<Button>("BtnBack");
            _btnBack.SetEnabled(false);
            _btnBack.RegisterCallback<ClickEvent>(OnBackClicked);

            _lblActionTitle = elementInstance.Q<Label>("LblActionTitle");
            _lblActionInfo = elementInstance.Q<Label>("LblActionInfo");

            var player = Storage.Player(MainScreenState.PlayerIndex);

            switch (player.TargetState)
            {
                case TargetState.Achieved:
                    _lblActionTitle.text = "You Win!";
                    _lblActionInfo.text = "Congratulations! You have achieved your goal.";
                    break;

                case TargetState.Failed:
                    _lblActionTitle.text = "Draw!";
                    _lblActionInfo.text = "Sorry! Nobody could achieve the target.";
                    break;

                default:
                    _lblActionTitle.text = "You Lost!";
                    _lblActionInfo.text = "An other player achieved his target faster then you!";
                    break;
            }

            // add element
            BootomPadding.Add(elementInstance);
            // avoid raycast through bottom bound UI
            Grid.RegisterBottomBound();

        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");
        }

        private void OnBackClicked(ClickEvent evt)
        {
            FlowController.ChangeScreenSubState(ScreenState.MainScreen, ScreenSubState.MainChoose);
        }
    }
}