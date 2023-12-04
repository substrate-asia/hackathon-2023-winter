using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;
using System.Linq;
using Assets.Scripts.ScreenStates;

namespace Assets.Scripts.ScreensSubState
{
    internal class MainChooseSubState : ScreenBaseState
    {
        public MainScreenState MainScreenState => ParentState as MainScreenState;

        private Button _btnTraining;
        private Button _btnVsAi;
        private Button _btnPvp;
        private Button _btnCancel;

        public MainChooseSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.style.backgroundColor = GameConstant.ColorLightGrey;
            floatBody.Clear();

            TemplateContainer scrollViewElement = ElementInstance("UI/Elements/ScrollViewElement");
            floatBody.Add(scrollViewElement);
            var scrollView = scrollViewElement.Q<ScrollView>("ScvElement");

            TemplateContainer elementInstance = ElementInstance("UI/Frames/ChooseFrame");

            _btnTraining = elementInstance.Q<Button>("BtnSingleMode");
            _btnVsAi = elementInstance.Q<Button>("BtnAIMode");
            _btnPvp = elementInstance.Q<Button>("BtnPvpMode");
            //_btnCancel = elementInstance.Q<Button>("BtnBack");

            _btnTraining.RegisterCallback((ClickEvent evt) =>
            {
                Debug.Log($"[Training] Start new game");
                FlowController.ChangeScreenSubState(ScreenState.MainScreen, ScreenSubState.Play);

                GameEventManager.OnStartGame("training");
            });

            _btnVsAi.RegisterCallback((ClickEvent evt) =>
            {
                Debug.Log($"[VsAI] Start new game");
                //FlowController.ChangeScreenState(ScreenState.HistoryScreen);
            });

            _btnPvp.RegisterCallback((ClickEvent evt) =>
            {
                Debug.Log($"[PvP] Start new game");
                //FlowController.ChangeScreenState(ScreenState.AccountScreen);
            });

            //_btnCancel.RegisterCallback((ClickEvent evt) =>
            //{
            //    Debug.Log($"[Cancel] Go back to login screen");
            //    FlowController.ChangeScreenState(ScreenState.StartScreen);
            //});


            // add element
            scrollView.Add(elementInstance);

            // subscribe to connection changes
            Network.ConnectionStateChanged += OnConnectionStateChanged;

            OnConnectionStateChanged(Network.Client.IsConnected);
        }

        private void OnConnectionStateChanged(bool IsConnected)
        {
            _btnPvp.SetEnabled(IsConnected);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

        }
    }
}