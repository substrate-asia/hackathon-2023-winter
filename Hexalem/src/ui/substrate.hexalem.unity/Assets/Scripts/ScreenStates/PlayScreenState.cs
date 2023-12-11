using Substrate.Hexalem.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class PlayScreenState : ScreenBaseState
    {
        private System.Random _random = new System.Random();


        public int SelectedTileIndex { get; set; } = -1;

        public HexaGame HexaGame { get; internal set; }

        public VisualTreeAsset TileCardElement { get; }

        public Texture2D TileHome { get; }
        public Texture2D TileGrass { get; }
        public Texture2D TileWater { get; }
        public Texture2D TileTrees { get; }
        public Texture2D TileMountain { get; }
        public Texture2D TileCave { get; }
        public Texture2D TileDesert { get; }


        private Label _lblManaValue;
        private Label _lblHumansValue;
        private Label _lblWaterValue;
        private Label _lblFoodValue;
        private Label _lblWoodValue;
        private Label _lblStoneValue;
        private Label _lblGoldValue;

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

            TestCreateGame();

            UpdateRessources();

            // add container
            FlowController.VelContainer.Add(instance);

            // load initial sub state
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            // remove container
            FlowController.VelContainer.RemoveAt(1);
        }

        private void TestCreateGame()
        {

            var playerId = new byte[32];
            _random.NextBytes(playerId);

            var hexaTuple = new List<(HexaPlayer, HexaBoard)>
            {
                { (new HexaPlayer(playerId), new HexaBoard(new byte[25])) }
            };

            var gameId = new byte[32];
            _random.NextBytes(gameId);
            HexaGame = new HexaGame(gameId, hexaTuple);
            HexaGame.Init(1234567);
        }

        private void UpdateRessources()
        {
            var pIndex = 0;

            _lblManaValue.text = HexaGame.HexaTuples[pIndex].player[RessourceType.Mana].ToString();
            _lblHumansValue.text = HexaGame.HexaTuples[pIndex].player[RessourceType.Humans].ToString();
            _lblWaterValue.text = HexaGame.HexaTuples[pIndex].player[RessourceType.Water].ToString();
            _lblFoodValue.text = HexaGame.HexaTuples[pIndex].player[RessourceType.Food].ToString();
            _lblWoodValue.text = HexaGame.HexaTuples[pIndex].player[RessourceType.Wood].ToString();
            _lblStoneValue.text = HexaGame.HexaTuples[pIndex].player[RessourceType.Stone].ToString();
            _lblGoldValue.text = HexaGame.HexaTuples[pIndex].player[RessourceType.Gold].ToString();
        }

    }
}