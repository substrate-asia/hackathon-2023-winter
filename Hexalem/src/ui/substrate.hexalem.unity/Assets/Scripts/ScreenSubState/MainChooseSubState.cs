using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;
using System.Linq;
using System;
using Substrate.Hexalem.Engine;
using Substrate.Integration.Client;
using Substrate.NetApi.Model.Types;
using System.Threading;

namespace Assets.Scripts.ScreenStates
{
    internal class MainChooseSubState : ScreenBaseState
    {
        private System.Random _random = new System.Random();

        private Button _btnPlay;

        private Label _LblExtriniscUpdate;

        private string _subscriptionId;

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

            _LblExtriniscUpdate = elementInstance.Q<Label>("LblExtriniscUpdate");

            // add element
            scrollView.Add(elementInstance);

            // subscribe to connection changes
            Network.ConnectionStateChanged += OnConnectionStateChanged;
            Storage.OnNextBlocknumber += OnNextBlocknumber;
            Network.Client.ExtrinsicManager.ExtrinsicUpdated += OnExtrinsicUpdated;
            Network.ExtrinsicCheck += OnExtrinsicCheck;

            OnConnectionStateChanged(Network.Client.IsConnected);


        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            // unsubscribe from event
            Network.ConnectionStateChanged -= OnConnectionStateChanged;
            Storage.OnNextBlocknumber -= OnNextBlocknumber;
            Network.Client.ExtrinsicManager.ExtrinsicUpdated -= OnExtrinsicUpdated;
            Network.ExtrinsicCheck -= OnExtrinsicCheck;
        }

        private void OnConnectionStateChanged(bool IsConnected)
        {
            if (_btnPlay.enabledSelf)
            {
                _btnPlay.SetEnabled(IsConnected);
            }
        }

        private void OnNextBlocknumber(uint blocknumber)
        {
            _btnPlay.SetEnabled(true);
            if (Storage.HexaGame == null)
            {
                _btnPlay.text = "PVP PLAY";
            }
            else
            {
                _btnPlay.text = "PVP JOIN";
            }
            
        }

        private void OnExtrinsicCheck()
        {

        }

        private void OnExtrinsicUpdated(string subscriptionId, ExtrinsicInfo extrinsicInfo)
        {
            if (_subscriptionId == null || _subscriptionId != subscriptionId)
            {
                return;
            }

            _LblExtriniscUpdate.text = $"{subscriptionId}: {extrinsicInfo.TransactionEvent}";
        }

        private void OnBtnTrainClicked(ClickEvent evt)
        {
            Storage.UpdateHexalem = false;

            var playerId = new byte[32];
            _random.NextBytes(playerId);

            var hexaTuple = new List<(HexaPlayer, HexaBoard)>
            {
                { (new HexaPlayer(playerId), new HexaBoard(new byte[25])) }
            };

            var gameId = new byte[32];
            _random.NextBytes(gameId);
            var hexaGame = new HexaGame(gameId, hexaTuple);
            hexaGame.Init(1234567);

            Storage.SetTrainStates(hexaGame);
            Storage.SetTrainStates(hexaGame.HexaTuples[0].board);

            FlowController.ChangeScreenState(ScreenState.PlayScreen);
        }

        private async void OnBtnPlayClicked(ClickEvent evt)
        {
            Storage.UpdateHexalem = true;

            if (Storage.HexaGame == null)
            {
                _btnPlay.text = "PVP PLAY";

                var subscriptionId = Network.Client.CreateGameAsync(Network.Client.Account, new List<Account>() { Network.Client.Account }, 25, 1, CancellationToken.None);
                if (subscriptionId == null)
                {
                    
                    return;
                }
            }
            else
            {
                _btnPlay.text = "PVP JOIN";

                FlowController.ChangeScreenState(ScreenState.PlayScreen);
            }
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