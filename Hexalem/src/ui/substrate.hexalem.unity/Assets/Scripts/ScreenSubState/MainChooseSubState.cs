using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;
using System.Linq;
using System;

namespace Assets.Scripts.ScreenStates
{
    internal class MainChooseSubState : ScreenBaseState
    {
        private Button _btnPlay;

        public MainScreenState MainScreenState => ParentState as MainScreenState;

        public MainChooseSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.Clear();

            TemplateContainer scrollViewElement = ElementInstance("UI/Elements/ScrollViewElement");
            floatBody.Add(scrollViewElement);

            var scrollView = scrollViewElement.Q<ScrollView>("ScvElement");

            TemplateContainer elementInstance = ElementInstance("UI/Frames/ChooseFrame");

            var btnTrain = elementInstance.Q<Button>("BtnTrain");
            btnTrain.RegisterCallback<ClickEvent>(OnBtnTrainClicked);

            _btnPlay = elementInstance.Q<Button>("BtnPlay");
            _btnPlay.RegisterCallback<ClickEvent>(OnBtnPlayClicked);

            var btnScore = elementInstance.Q<Button>("BtnScore");
            btnScore.RegisterCallback<ClickEvent>(OnBtnScoreClicked);

            var btnExit= elementInstance.Q<Button>("BtnExit");
            btnExit.RegisterCallback<ClickEvent>(OnBtnExitClicked);

            // add element
            scrollView.Add(elementInstance);

            // subscribe to connection changes
            Network.ConnectionStateChanged += OnConnectionStateChanged;

            OnConnectionStateChanged(Network.Client.IsConnected);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            // unsubscribe from event
            Network.ConnectionStateChanged -= OnConnectionStateChanged;
        }

        private void OnConnectionStateChanged(bool IsConnected)
        {
            _btnPlay.SetEnabled(IsConnected);
        }

        private void OnBtnTrainClicked(ClickEvent evt)
        {
            Debug.Log($"[{this.GetType().Name}][SUB] OnBtnTrainClicked");
        }

        private void OnBtnPlayClicked(EventBase @base)
        {
            FlowController.ChangeScreenSubState(ScreenState.MainScreen, ScreenSubState.Play);
        }
        private void OnBtnScoreClicked(ClickEvent evt)
        {
            Debug.Log($"[{this.GetType().Name}][SUB] OnBtnScoreClicked");
        }

        private void OnBtnExitClicked(ClickEvent evt)
        {
            Debug.Log($"[{this.GetType().Name}][SUB] OnBtnExitClicked");
        }
    }
}