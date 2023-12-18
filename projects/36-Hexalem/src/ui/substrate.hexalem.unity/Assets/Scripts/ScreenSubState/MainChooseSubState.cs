using Substrate.Hexalem.Engine;
using Substrate.Integration.Client;
using Substrate.NetApi.Model.Types;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    internal class MainChooseSubState : ScreenBaseState
    {
        public MainScreenState PlayScreenState => ParentState as MainScreenState;

        private readonly System.Random _random = new System.Random();

        private Button _btnPlay;
        private Button _btnTrain;
        private Button _btnReset;

        private Label _lblExtriniscUpdate;

        private string _subscriptionId;

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

            _btnTrain = elementInstance.Q<Button>("BtnTrain");
            _btnTrain.RegisterCallback<ClickEvent>(OnBtnTrainClicked);

            _btnPlay = elementInstance.Q<Button>("BtnPlay");
            _btnPlay.SetEnabled(false);
            _btnPlay.RegisterCallback<ClickEvent>(OnBtnPlayClicked);

            var btnExit = elementInstance.Q<Button>("BtnExit");
            btnExit.RegisterCallback<ClickEvent>(OnBtnExitClicked);

            _btnReset = elementInstance.Q<Button>("BtnReset");
            _btnReset.SetEnabled(false);
            _btnReset.RegisterCallback<ClickEvent>(OnBtnResetClicked);

            _lblExtriniscUpdate = elementInstance.Q<Label>("LblExtriniscUpdate");

            // add element
            scrollView.Add(elementInstance);

            // subscribe to connection changes
            Network.ConnectionStateChanged += OnConnectionStateChanged;
            Storage.OnStorageUpdated += OnStorageUpdated;
            Network.Client.ExtrinsicManager.ExtrinsicUpdated += OnExtrinsicUpdated;
            Network.ExtrinsicCheck += OnExtrinsicCheck;

            OnConnectionStateChanged(Network.Client.IsConnected);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            // unsubscribe from event
            Network.ConnectionStateChanged -= OnConnectionStateChanged;
            Storage.OnStorageUpdated -= OnStorageUpdated;
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

        private void OnStorageUpdated(uint blocknumber)
        {
            if (Network.Client.ExtrinsicManager.Running.Any())
            {
                _btnPlay.SetEnabled(false);
                _btnReset.SetEnabled(false);
                return;
            }

            if (Storage.HexaGame == null)
            {
                _btnPlay.text = "CREATE";
                _lblExtriniscUpdate.text = "\"No pvp game to join, bro!\"";
            }
            else
            {
                _btnPlay.text = "JOIN";
                _lblExtriniscUpdate.text = $"\"Hey bro, {Storage.HexaGame.PlayersCount} buddies, waiting!\"";
                _btnReset.SetEnabled(true);
            }

            _btnPlay.SetEnabled(true);
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
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                switch (extrinsicInfo.TransactionEvent)
                {
                    case Substrate.NetApi.Model.Rpc.TransactionEvent.Validated:
                        _lblExtriniscUpdate.text = $"\"Oh bro, need to check what you sent me.\"";
                        break;

                    case Substrate.NetApi.Model.Rpc.TransactionEvent.Broadcasted:
                        _lblExtriniscUpdate.text = $"\"Pump the jam, let's shuffle the dices, gang.\"";
                        break;

                    case Substrate.NetApi.Model.Rpc.TransactionEvent.BestChainBlockIncluded:
                        _lblExtriniscUpdate.text = $"\"Besti, bro!\"";
                        break;

                    case Substrate.NetApi.Model.Rpc.TransactionEvent.Finalized:
                        _lblExtriniscUpdate.text = $"\"We got a stamp!\"";
                        break;

                    case Substrate.NetApi.Model.Rpc.TransactionEvent.Error:
                        _lblExtriniscUpdate.text = $"\"That doesn't work, bro!\"";
                        break;

                    case Substrate.NetApi.Model.Rpc.TransactionEvent.Invalid:
                        _lblExtriniscUpdate.text = $"\"Invalid, bro, your invalid!\"";
                        break;

                    case Substrate.NetApi.Model.Rpc.TransactionEvent.Dropped:
                        _lblExtriniscUpdate.text = $"\"Gonna, drop this, bro.\"";
                        break;

                    default:
                        _lblExtriniscUpdate.text = $"\"No blue, funk soul bro!\"";
                        break;
                }
            });
        }

        private void OnBtnTrainClicked(ClickEvent evt)
        {
            Storage.UpdateHexalem = false;

            var hexaTuple = new List<(HexaPlayer, HexaBoard)>
            {
                { (new HexaPlayer(Network.Client.Account.Bytes), new HexaBoard(new byte[(int)GridSize.Medium])) }
            };

            var gameId = new byte[HexalemConfig.GAME_STORAGE_ID];
            _random.NextBytes(gameId);
            var hexaGame = new HexaGame(gameId, hexaTuple);
            hexaGame.Init(1234567);

            Storage.SetTrainGame(hexaGame, 0);

            FlowController.ChangeScreenState(ScreenState.PlayScreen);
        }

        private async void OnBtnPlayClicked(ClickEvent evt)
        {
            Storage.UpdateHexalem = true;

            if (Storage.HexaGame != null)
            {
                FlowController.ChangeScreenState(ScreenState.PlayScreen);
            }
            else if (!Network.Client.ExtrinsicManager.Running.Any())
            {
                _btnTrain.SetEnabled(false);
                _btnPlay.SetEnabled(false);
                _btnPlay.text = "WAIT";
                var subscriptionId = await Network.Client.CreateGameAsync(Network.Client.Account, new List<Account>() { Network.Client.Account }, 25, 1, CancellationToken.None);
                if (subscriptionId == null)
                {
                    _btnTrain.SetEnabled(true);
                    _btnPlay.SetEnabled(true);
                    return;
                }

                Debug.Log($"Extrinsic[CreateGameAsync] submited: {subscriptionId}");

                _subscriptionId = subscriptionId;
            }
        }

        private async void OnBtnResetClicked(ClickEvent evt)
        {
            if (Storage.HexaGame != null && !Network.Client.ExtrinsicManager.Running.Any())
            {
                _btnPlay.SetEnabled(false);
                _btnPlay.text = "WAIT";
                _btnReset.SetEnabled(false);
                var call = Substrate.Integration.Call.PalletHexalem.HexalemRootDeleteGame(Storage.HexaGame.Id);
                // TODO: make sure we use SUDO for this call
                var subscriptionId = await Network.Client.SudoAsync(Network.Sudo, call, 1, CancellationToken.None);
                if (subscriptionId == null)
                {
                    _btnPlay.SetEnabled(true);
                    _btnReset.SetEnabled(true);
                    return;
                }

                Debug.Log($"Extrinsic[RootDeleteGameAsync] submited: {subscriptionId}");

                _subscriptionId = subscriptionId;
            }
        }

        private void OnBtnExitClicked(ClickEvent evt)
        {
            Debug.Log($"[{this.GetType().Name}][SUB] OnBtnExitClicked");
        }
    }
}