using Substrate.Hexalem.Engine;
using Substrate.Integration.Client;
using Substrate.NetApi.Model.Types.Primitive;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class PlayScreenState : ScreenBaseState
    {
        public int SelectedGridIndex { get; set; } = -1;
        public int SelectedCardIndex { get; set; } = -1;

        public VisualTreeAsset TileCardElement { get; }

        public Texture2D TileHome { get; }
        public Texture2D TileGrass { get; }
        public Texture2D TileWater { get; }
        public Texture2D TileTrees { get; }
        public Texture2D TileMountain { get; }
        public Texture2D TileCave { get; }
        public Texture2D TileDesert { get; }

        public Texture2D PortraitAlice { get; }
        public Texture2D PortraitBob { get; }
        public Texture2D PortraitCharlie { get; }
        public Texture2D PortraitDave { get; }

        public int PlayerIndex { get; private set; }

        private Label _lblManaValue;
        private Label _lblHumansValue;
        private Label _lblWaterValue;
        private Label _lblFoodValue;
        private Label _lblWoodValue;
        private Label _lblStoneValue;
        private Label _lblGoldValue;

        private Label _lblRoundValue;

        private VisualElement _velRankingBox;
        private VisualElement _velTargetBox;
        private VisualElement _velEndTurnBox;
        private VisualElement _velExtrinsicFrame;

        private VisualElement _velTimerProgress;

        private Label _lblExtriniscInfo;

        private int _subscriptionIndex;
        private List<string> _subscriptionOrder;
        private Dictionary<string, ExtrinsicInfo> _subscriptionDict;

        public PlayScreenState(FlowController _flowController)
            : base(_flowController)
        {
            // load assets here
            TileCardElement = Resources.Load<VisualTreeAsset>($"UI/Elements/TileCardElement");

            TileHome = Resources.Load<Texture2D>($"Images/tile_home");
            TileGrass = Resources.Load<Texture2D>($"Images/tile_grass");
            TileWater = Resources.Load<Texture2D>($"Images/tile_water");
            TileTrees = Resources.Load<Texture2D>($"Images/tile_trees");
            TileMountain = Resources.Load<Texture2D>($"Images/tile_mountain");
            TileCave = Resources.Load<Texture2D>($"Images/tile_cave");
            TileDesert = Resources.Load<Texture2D>($"Images/tile_desert");

            PortraitAlice = Resources.Load<Texture2D>($"Images/alice_portrait");
            PortraitBob = Resources.Load<Texture2D>($"Images/bob_portrait");
            PortraitCharlie = Resources.Load<Texture2D>($"Images/charlie_portrait");
            PortraitDave = Resources.Load<Texture2D>($"Images/dave_portrait");
        }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            _subscriptionIndex = 0;
            _subscriptionOrder = new List<string>();
            _subscriptionDict = new Dictionary<string, ExtrinsicInfo>();

            PlayerIndex = Storage.PlayerIndex(Network.Client.Account).Value;

            // filler is to avoid camera in the ui
            var topFiller = FlowController.VelContainer.Q<VisualElement>("VelTopFiller");
            topFiller.style.backgroundColor = GameConstant.ColorDark;

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/PlayScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);

            var topBound = instance.Q<VisualElement>("TopBound");

            var velPortrait = instance.Q<VisualElement>("VelPortrait");
            switch (Network.CurrentAccountType)
            {
                case AccountType.Alice:
                    velPortrait.style.backgroundImage = new StyleBackground(PortraitAlice);
                    break;

                case AccountType.Bob:
                    velPortrait.style.backgroundImage = new StyleBackground(PortraitBob);
                    break;

                case AccountType.Charlie:
                    velPortrait.style.backgroundImage = new StyleBackground(PortraitCharlie);
                    break;

                case AccountType.Dave:
                    velPortrait.style.backgroundImage = new StyleBackground(PortraitDave);
                    break;
            }

            _lblManaValue = topBound.Q<Label>("LblManaValue");
            _lblHumansValue = topBound.Q<Label>("LblHumansValue");
            _lblWaterValue = topBound.Q<Label>("LblWaterValue");
            _lblFoodValue = topBound.Q<Label>("LblFoodValue");
            _lblWoodValue = topBound.Q<Label>("LblWoodValue");
            _lblStoneValue = topBound.Q<Label>("LblStoneValue");
            _lblGoldValue = topBound.Q<Label>("LblGoldValue");

            _lblRoundValue = topBound.Q<Label>("LblRoundValue");

            _velRankingBox = topBound.Q<VisualElement>("VelRankingBox");
            _velRankingBox.RegisterCallback<ClickEvent>(OnRankingClicked);

            _velTargetBox = topBound.Q<VisualElement>("VelTargetBox");
            _velTargetBox.RegisterCallback<ClickEvent>(OnTargetClicked);

            _velEndTurnBox = topBound.Q<VisualElement>("VelEndTurnBox");
            _velEndTurnBox.SetEnabled(false);
            _velEndTurnBox.RegisterCallback<ClickEvent>(OnEndTurnClicked);

            _velTimerProgress = _velEndTurnBox.Q<VisualElement>("VelTimerProgress");

            _lblExtriniscInfo = topBound.Q<Label>("LblExtriniscInfo");
            _velExtrinsicFrame = topBound.Q<VisualElement>("VelExtrinsicFrame");

            // add container
            FlowController.VelContainer.Add(instance);

            // load initial sub state
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);

            // initial update
            _lblRoundValue.text = $"R:{Storage.HexaGame.PlayerTurn} T:{Storage.HexaGame.HexBoardRound}";
            OnChangedHexaPlayer(Storage.HexaGame.HexaTuples[PlayerIndex].player);
            OnChangedHexaBoard(Storage.HexaGame.HexaTuples[PlayerIndex].board);

            Storage.OnChangedHexaBoard += OnChangedHexaBoard;
            Storage.OnChangedHexaPlayer += OnChangedHexaPlayer;
            Storage.OnNextPlayerTurn += OnNextPlayerTurn;
            Storage.OnBoardStateChanged += OnBoardStateChanged;
            Storage.OnStorageUpdated += OnStorageUpdated;
            Storage.OnNextBlocknumber += OnNextBlockNumber;

            Network.Client.ExtrinsicManager.ExtrinsicUpdated += OnExtrinsicUpdated;
            Network.ExtrinsicCheck += OnExtrinsicCheck;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            // remove container
            FlowController.VelContainer.RemoveAt(1);

            Storage.OnChangedHexaBoard -= OnChangedHexaBoard;
            Storage.OnChangedHexaPlayer -= OnChangedHexaPlayer;
            Storage.OnNextPlayerTurn -= OnNextPlayerTurn;
            Storage.OnBoardStateChanged -= OnBoardStateChanged;

            Network.Client.ExtrinsicManager.ExtrinsicUpdated -= OnExtrinsicUpdated;
            Network.ExtrinsicCheck -= OnExtrinsicCheck;
            Storage.OnStorageUpdated -= OnStorageUpdated;
            Storage.OnNextBlocknumber -= OnNextBlockNumber;
        }

        private void OnNextBlockNumber(uint blocknumber)
        {
            Debug.Log($"PlayScreenState OnNextBlockNumber > {blocknumber}");

            if (Storage.HexaGame.PlayerTurn != PlayerIndex)
            {
                // Add red progress bar
                _velTimerProgress.style.height = Length.Percent(100);
                _velTimerProgress.style.backgroundColor = GameConstant.PastelRed;
                return;
            }

            var lastBlockNumber = new U32();
            lastBlockNumber.Create(Storage.HexaGame.LastMove);
            var blockNumberPassed = blocknumber - lastBlockNumber;

            var percentage = Math.Min((float)blockNumberPassed / GameConfig.MAX_TURN_BLOCKS * 100, 100);
            Debug.Log($"PlayScreenState LastBlockNumber = {lastBlockNumber} | blockNumberPassed = {blockNumberPassed} | percentage = {percentage}");
            _velTimerProgress.style.height = Length.Percent(percentage);

            if(percentage <= 60)
            {
                _velTimerProgress.style.backgroundColor = GameConstant.PastelGreen;
            } else if(percentage <= 80)
            {
                _velTimerProgress.style.backgroundColor = GameConstant.PastelOrange;
            } else
            {
                _velTimerProgress.style.backgroundColor = GameConstant.PastelRed;
            }
        }

        private void OnStorageUpdated(uint blocknumber)
        {
            Debug.Log($"[{this.GetType().Name}] OnStorageUpdated {blocknumber}");
            if (!Network.Client.ExtrinsicManager.PreInblock.Any())
            {
                _velEndTurnBox.SetEnabled(PlayerIndex == Storage.HexaGame.PlayerTurn);
            }

            _lblRoundValue.text = $"R:{Storage.HexaGame.PlayerTurn} T:{Storage.HexaGame.HexBoardRound}";
        }

        private void OnExtrinsicCheck()
        {
            if (!Network.Client.IsConnected)
            {
                //_lblExtriniscInfo.text = "Not connected";
                //_velExtrinsicFrame.style.backgroundColor = GameConstant.PastelRed;
                _subscriptionOrder.Clear();
                _subscriptionDict.Clear();
            }
            else if (!Network.Client.ExtrinsicManager.Running.Any())
            {
                _velExtrinsicFrame.style.backgroundColor = GameConstant.PastelGray;
                _lblExtriniscInfo.text = "No extrinsics";
            }
        }

        private void OnExtrinsicUpdated(string subscriptionId, ExtrinsicInfo extrinsicInfo)
        {
            Debug.Log($"[{GetType().Name}] OnExtrinsicUpdated {subscriptionId} {extrinsicInfo.TransactionEvent}");

            if (!_subscriptionDict.ContainsKey(subscriptionId))
            {
                _subscriptionOrder.Add(subscriptionId);
                _subscriptionDict.Add(subscriptionId, extrinsicInfo);
            }
            else
            {
                _subscriptionDict[subscriptionId] = extrinsicInfo;
            }

            var infoStr = "Unknown";
            if (extrinsicInfo.ExtrinsicType != null)
            {
                infoStr = extrinsicInfo.ExtrinsicType.Contains(".") ? extrinsicInfo.ExtrinsicType.Split(".")[1] : extrinsicInfo.ExtrinsicType;
            }

            var color = GameConstant.GetColor(extrinsicInfo.TransactionEvent.Value);

            // dispatch to main thread as the call comes from outside
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                // clean up
                if (extrinsicInfo.TransactionEvent == Substrate.NetApi.Model.Rpc.TransactionEvent.BestChainBlockIncluded && (extrinsicInfo.HasEvents || extrinsicInfo.Error != null))
                {
                    if (extrinsicInfo.Error != null)
                    {
                        _lblExtriniscInfo.text = $"[APIError] {extrinsicInfo.Error}";
                    }
                    else if (extrinsicInfo.SystemExtrinsicEvent(out Substrate.Hexalem.NET.NetApiExt.Generated.Model.frame_system.pallet.Event? systemExtrinsicEvent, out string errorMsg))
                    {
                        _velExtrinsicFrame.style.backgroundColor = systemExtrinsicEvent.Value ==
                        Substrate.Hexalem.NET.NetApiExt.Generated.Model.frame_system.pallet.Event.ExtrinsicSuccess ?
                        GameConstant.PastelGreen :
                        GameConstant.PastelOrange;
                        _lblExtriniscInfo.text = $"{systemExtrinsicEvent.Value}";
                        Debug.Log($"{systemExtrinsicEvent.Value}]" + (errorMsg != null ? errorMsg : ""));
                    }
                    else
                    {
                        _lblExtriniscInfo.text = $"[APIError] Unable system event";
                    }
                }
                else
                {
                    _velExtrinsicFrame.style.backgroundColor = color;
                    _lblExtriniscInfo.text = $"[{extrinsicInfo.TransactionEvent}] {infoStr}";
                }
            });

            if (extrinsicInfo.IsCompleted)
            {
                _subscriptionOrder.Remove(subscriptionId);
                _subscriptionDict.Remove(subscriptionId);
            }
        }

        private void OnRankingClicked(ClickEvent evt)
        {
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayRanking);
        }

        private void OnTargetClicked(ClickEvent evt)
        {
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayTarget);
        }

        private async void OnEndTurnClicked(ClickEvent evt)
        {
            _velEndTurnBox.SetEnabled(false);

            if (!Storage.UpdateHexalem)
            {
                var result = Game.FinishTurn(Storage.MockBlockNumber, (HexaGame)Storage.HexaGame.Clone(), (byte)PlayerIndex);

                if (result == null)
                {
                    _velEndTurnBox.SetEnabled(true);
                    Debug.Log("Failed to finish turn!");
                    return;
                }

                Storage.SetTrainGame(result, PlayerIndex);
            }
            else if (!Network.Client.ExtrinsicManager.PreInblock.Any())
            {
                var subscriptionId = await Network.Client.FinishTurnAsync(Network.Client.Account, 1, CancellationToken.None);
                if (subscriptionId == null)
                {
                    _velEndTurnBox.SetEnabled(true);
                    return;
                }

                Debug.Log($"Extrinsic[PlayAsync] submited: {subscriptionId}");
                FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayWaiting);
            }
        }

        private void OnChangedHexaBoard(HexaBoard HexaBoard)
        {
            Grid.CreateGrid(HexaBoard);
        }

        private void OnChangedHexaPlayer(HexaPlayer hexaPlayer)
        {
            _lblManaValue.text = hexaPlayer[RessourceType.Mana].ToString();
            _lblHumansValue.text = hexaPlayer[RessourceType.Humans].ToString();
            _lblWaterValue.text = hexaPlayer[RessourceType.Water].ToString();
            _lblFoodValue.text = hexaPlayer[RessourceType.Food].ToString();
            _lblWoodValue.text = hexaPlayer[RessourceType.Wood].ToString();
            _lblStoneValue.text = hexaPlayer[RessourceType.Stone].ToString();
            _lblGoldValue.text = hexaPlayer[RessourceType.Gold].ToString();
        }

        private void OnNextPlayerTurn(byte playerTurn)
        {
            //FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayNextTurn);
        }

        //private void UpdateTimerProgress(object source, ElapsedEventArgs e)
        //{
        //    // ChangeEvent height
        //    var currentHeight = _velTimerProgress.style.height.value;
        //    var nextHeight = currentHeight.value + Length.Percent(10).value;
        //    if (nextHeight >= 100) nextHeight = 100;

        //    Debug.Log($"Timer progress, height = {currentHeight}");
        //    _velTimerProgress.style.height = Length.Percent(40);
        //}

        private void OnBoardStateChanged(HexBoardState boardState)
        {
            Debug.Log($"New board state {boardState}");
            if (boardState == HexBoardState.Finish)
            {
                FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayFinish);
            }
        }
    }
}