using Substrate.Hexalem.Engine;
using Substrate.Integration.Client;
using Substrate.Integration.Helper;
using Substrate.NetApi.Model.Meta;
using Substrate.NetApi.Model.Types.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class PlayScreenState : ScreenBaseState
    {
        public uint Blocknumber { get; set; } = 123124;

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
        public int PlayerIndex { get; private set; }

        private Label _lblManaValue;
        private Label _lblHumansValue;
        private Label _lblWaterValue;
        private Label _lblFoodValue;
        private Label _lblWoodValue;
        private Label _lblStoneValue;
        private Label _lblGoldValue;

        private VisualElement _velEndTurnBox;


        private List<string> _subscriptionOrder;
        private Dictionary<string, ExtrinsicInfo> _subscriptionDict;

        public PlayScreenState(FlowController _flowController)
            : base(_flowController) {

            // load assets here
            TileCardElement = Resources.Load<VisualTreeAsset>($"UI/Elements/TileCardElement");

            TileHome = Resources.Load<Texture2D>($"Images/tile_home");
            TileGrass = Resources.Load<Texture2D>($"Images/tile_grass");
            TileWater = Resources.Load<Texture2D>($"Images/tile_water");
            TileTrees = Resources.Load<Texture2D>($"Images/tile_trees");
            TileMountain = Resources.Load<Texture2D>($"Images/tile_mountain");
            TileCave = Resources.Load<Texture2D>($"Images/tile_cave");
            TileDesert = Resources.Load<Texture2D>($"Images/tile_desert");
        }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            PlayerIndex = Storage.PlayerIndex(Network.Client.Account).Value;

            // filler is to avoid camera in the ui
            var topFiller = FlowController.VelContainer.Q<VisualElement>("VelTopFiller");
            topFiller.style.backgroundColor = GameConstant.ColorDark;

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/PlayScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);

            var topBound = instance.Q<VisualElement>("TopBound");

            _lblManaValue = instance.Q<Label>("LblManaValue");
            _lblHumansValue = instance.Q<Label>("LblHumansValue");
            _lblWaterValue = instance.Q<Label>("LblWaterValue");
            _lblFoodValue = instance.Q<Label>("LblFoodValue");
            _lblWoodValue = instance.Q<Label>("LblWoodValue");
            _lblStoneValue = instance.Q<Label>("LblStoneValue");
            _lblGoldValue = instance.Q<Label>("LblGoldValue");

            _velEndTurnBox = instance.Q<VisualElement>("VelEndTurnBox");
            _velEndTurnBox.RegisterCallback<ClickEvent>(OnEndTurnClicked);

            // add container
            FlowController.VelContainer.Add(instance);

            // load initial sub state
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);

            // initial update
            OnChangedHexaPlayer(Storage.HexaGame.HexaTuples[PlayerIndex].player);
            OnChangedHexaBoard(Storage.HexaGame.HexaTuples[PlayerIndex].board);

            Storage.OnChangedHexaBoard += OnChangedHexaBoard;
            Storage.OnChangedHexaPlayer += OnChangedHexaPlayer;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            // remove container
            FlowController.VelContainer.RemoveAt(1);

            Storage.OnChangedHexaBoard -= OnChangedHexaBoard;
        }

        private void OnExtrinsicCheck()
        {
            if (_subscriptionOrder.Count == 0)
            {

            }

            if (!Network.Client.IsConnected)
            {
                _subscriptionOrder.Clear();
                _subscriptionDict.Clear();
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

            // dispatch to main thread as the call comes from outside
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                // clean up
                if (extrinsicInfo.TransactionEvent == Substrate.NetApi.Model.Rpc.TransactionEvent.BestChainBlockIncluded && (extrinsicInfo.HasEvents || extrinsicInfo.Error != null))
                {
                    if (extrinsicInfo.Error != null)
                    {

                    }
                    else if (extrinsicInfo.SystemExtrinsicEvent(out Substrate.Hexalem.NET.NetApiExt.Generated.Model.frame_system.pallet.Event? systemExtrinsicEvent, out string errorMsg))
                    {

                    }
                    else
                    {

                    }
                }
            });

            if (extrinsicInfo.IsCompleted)
            {

            }
        }

        private void OnEndTurnClicked(ClickEvent evt)
        {
            if (!Storage.UpdateHexalem)
            {
                // increment block number
                Blocknumber++;

                var result = Game.FinishTurn(Blocknumber, (HexaGame)Storage.HexaGame.Clone(), (byte)PlayerIndex);

                if (result == null)
                {
                    Debug.Log("Failed to finish turn!");
                    return;
                }

                Storage.SetTrainGame(result, PlayerIndex);


                FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayNextTurn);
            }
            else
            {
                Debug.Log("Not implemented!!!!");
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

    }
}