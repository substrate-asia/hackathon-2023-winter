using Assets.Scripts.ScreenStates;
using Substrate.Integration.Helper;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayNextTurnSubState : ScreenBaseState
    {
        public PlayScreenState MainScreenState => ParentState as PlayScreenState;

        private Button _btnYourTurn;

        private Label _lblActionInfo;
        private Label _lblActionTitle;

        public PlayNextTurnSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var BootomPadding = FlowController.VelContainer.Q<VisualElement>("BottomPadding");
            BootomPadding.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Elements/BottomNextTurnElement");

            _btnYourTurn = elementInstance.Q<Button>("BtnYourTurn");
            _btnYourTurn.SetEnabled(false);
            _btnYourTurn.RegisterCallback<ClickEvent>(OnYourTurnClicked);

            _lblActionTitle = elementInstance.Q<Label>("LblActionTitle");
            _lblActionInfo = elementInstance.Q<Label>("LblActionInfo");

            // add element
            BootomPadding.Add(elementInstance);
            // avoid raycast through bottom bound UI
            Grid.RegisterBottomBound();

            OnNextPlayerTurn(Storage.HexaGame.PlayerTurn);

            Storage.OnNextPlayerTurn += OnNextPlayerTurn;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            Storage.OnNextPlayerTurn -= OnNextPlayerTurn;
        }

        private void OnNextPlayerTurn(byte playerTurn)
        {
            _btnYourTurn.SetEnabled(playerTurn == MainScreenState.PlayerIndex);

            if (playerTurn != MainScreenState.PlayerIndex)
            {
                _lblActionTitle.text = $"Waiting on player {playerTurn} turn ...";
            }
            else
            {
                _lblActionTitle.text = $"Let's go it's your turn!";
            }

            _lblActionInfo.text = $"Player[{playerTurn}] turn is \n{Storage.HexaGame.HexaTuples[playerTurn].player.Value.ToAddress()}";
        }

        private void OnYourTurnClicked(ClickEvent evt)
        {
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }
    }
}