using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using System;
using System.Linq;
using System.Reflection;
using UnityEngine;
using UnityEngine.Tilemaps;
using UnityEngine.UIElements;
using UnityEngine.WSA;

namespace Assets.Scripts
{
    internal class PlayNextTurnSubState : ScreenBaseState
    {
        public PlayScreenState MainScreenState => ParentState as PlayScreenState;

        private Button _btnYourTurn;

        public PlayNextTurnSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Frames/PlayNextTurnFrame");
            
            _btnYourTurn = elementInstance.Q<Button>("BtnYourTurn");
            _btnYourTurn.RegisterCallback<ClickEvent>(OnYourTurnClicked);

            // add element
            floatBody.Add(elementInstance);

        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");
        }

        private void OnYourTurnClicked(ClickEvent evt)
        {
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

    }
}