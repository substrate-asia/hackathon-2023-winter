using Assets.Scripts.ScreenStates;
using Substrate.Integration.Helper;
using System;
using System.Linq;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayWaitingSubState : ScreenBaseState
    {
        public PlayScreenState PlayScreenState => ParentState as PlayScreenState;

        private VisualElement _bottomBound;
        private VisualElement _bootomPadding;

        private Label _lblActionInfo;

        public PlayWaitingSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            _bottomBound = FlowController.VelContainer.Q<VisualElement>("BottomBound");
            _bootomPadding = FlowController.VelContainer.Q<VisualElement>("BottomPadding");
            _bootomPadding.Clear();

            _bottomBound.style.height = 200;
            _bootomPadding.style.height = 200;

            TemplateContainer elementInstance = ElementInstance("UI/Elements/BottomWaitingElement");

            _lblActionInfo = elementInstance.Q<Label>("LblActionInfo");

            // add element
            _bootomPadding.Add(elementInstance);
            // avoid raycast through bottom bound UI
            Grid.RegisterBottomBound();

            OnNextPlayerTurn(Storage.HexaGame.PlayerTurn);

            Storage.OnNextPlayerTurn += OnNextPlayerTurn;
            Network.ExtrinsicCheck += OnExtrinsicCheck;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            Storage.OnNextPlayerTurn -= OnNextPlayerTurn;
            Network.ExtrinsicCheck -= OnExtrinsicCheck;

            _bottomBound.style.height = 600;
            _bootomPadding.style.height = 600;
        }

        private void OnExtrinsicCheck()
        {
            if (Network.Client.ExtrinsicManager.PreInblock.Any())
            {
                _lblActionInfo.text = "Bro, need to find an other brick in the wall!";
                return;
            }

            if ( PlayScreenState.PlayerIndex != Storage.HexaGame.PlayerTurn)
            {
                _lblActionInfo.text = "Patience you must have, my young Polkawan!";
                return;
            }

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        private void OnNextPlayerTurn(byte playerTurn)
        {
            if (Network.Client.ExtrinsicManager.PreInblock.Any())
            {
                _lblActionInfo.text = "Bro, need to find an other brick in the wall!";
                return;
            }

            if (PlayScreenState.PlayerIndex != Storage.HexaGame.PlayerTurn)
            {
                _lblActionInfo.text = "Patience you must have, my young Polkawan!";
                return;
            }

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }
    }
}