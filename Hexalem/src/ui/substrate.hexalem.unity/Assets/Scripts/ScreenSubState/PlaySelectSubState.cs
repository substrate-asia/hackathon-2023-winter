using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using System;
using System.Linq;
using UnityEngine;
using UnityEngine.Tilemaps;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlaySelectSubState : ScreenBaseState
    {
        public PlayScreenState MainScreenState => ParentState as PlayScreenState;

        private ScrollView _scvSelection;
        private Label _lblActionInfo;



        public PlaySelectSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Frames/PlaySelectFrame");
            
            _scvSelection = elementInstance.Q<ScrollView>("ScVSelection");
            _lblActionInfo = elementInstance.Q<Label>("LblActionInfo");

            // add element
            floatBody.Add(elementInstance);

            UpdateSelection();

            Grid.OnGridTileClicked += OnGridTileClicked;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            Grid.OnGridTileClicked -= OnGridTileClicked;
        }

        private void OnGridTileClicked(GameObject tileObject, int index)
        {
            Debug.Log($"[{this.GetType().Name}][SUB] OnGridTileClicked Change to Upgrade, if possible.");
        }

        private void UpdateSelection()
        {
            var offer = MainScreenState.HexaGame.UnboundTileOffers;
            var selectionTileOffers = offer.Select(p => (index:p, info:GameConfig.TILE_COSTS[p])).ToList();
            foreach (var selectionTile in selectionTileOffers)
            {
                var tileCard = MainScreenState.TileCardElement.Instantiate();

                tileCard.Q<Label>("LblTileName").text = selectionTile.info.TileToBuy.TileType.ToString() + "(Norm)";

                tileCard.Q<Label>("LblRoundPre").text = "(+1";
                tileCard.Q<Label>("LblManaCost").text = "1";

                var velTileImage = tileCard.Q<VisualElement>("VelTileImage");
                switch (selectionTile.info.TileToBuy.TileType)
                {
                    case TileType.Home:
                        velTileImage.style.backgroundImage = new StyleBackground(MainScreenState.TileHome);
                        break;
                    case TileType.Grass:
                        velTileImage.style.backgroundImage = new StyleBackground(MainScreenState.TileGrass);
                        break;
                    case TileType.Water:
                        velTileImage.style.backgroundImage = new StyleBackground(MainScreenState.TileWater);
                        break;
                    case TileType.Tree:
                        velTileImage.style.backgroundImage = new StyleBackground(MainScreenState.TileTrees);
                        break;
                    case TileType.Mountain:
                        velTileImage.style.backgroundImage = new StyleBackground(MainScreenState.TileMountain);
                        break;
                    case TileType.Cave:
                        velTileImage.style.backgroundImage = new StyleBackground(MainScreenState.TileCave);
                        break;
                    case TileType.Desert:
                        velTileImage.style.backgroundImage = new StyleBackground(MainScreenState.TileDesert);
                        break;
                }

                tileCard.AddManipulator(new Clickable(() => OnTileCardClicked(tileCard, selectionTile.index, selectionTile.info)));

                _scvSelection.Add(tileCard);
            } 

            _lblActionInfo.text = $"{_scvSelection.Children().Count()}/{MainScreenState.HexaGame.SelectBase} Tile(s) available";

        }

        private void OnTileCardClicked(TemplateContainer tileCard, byte index, TileOffer info)
        {

            MainScreenState.SelectedTileIndex = index;

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayTileSelect);

        }
    }
}