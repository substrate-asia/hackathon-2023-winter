using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlaySelectSubState : ScreenBaseState
    {
        public PlayScreenState PlayScreenState => ParentState as PlayScreenState;

        private ScrollView _scvSelection;
        private Label _lblActionInfo;

        public PlaySelectSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var BootomPadding = FlowController.VelContainer.Q<VisualElement>("BottomPadding");
            BootomPadding.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Elements/BottomSelectionElement");

            _scvSelection = elementInstance.Q<ScrollView>("ScVSelection");
            _lblActionInfo = elementInstance.Q<Label>("LblActionInfo");

            // add element
            BootomPadding.Add(elementInstance);
            // avoid raycast through bottom bound UI
            Grid.RegisterBottomBound();

            OnChangedHexaSelection(Storage.HexaGame.UnboundTileOffers);

            Grid.OnGridTileClicked += OnGridTileClicked;
            Storage.OnChangedHexaSelection += OnChangedHexaSelection;
            Storage.OnNextPlayerTurn += OnNextPlayerTurn;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            Grid.OnGridTileClicked -= OnGridTileClicked;
            Storage.OnNextPlayerTurn -= OnNextPlayerTurn;
            Storage.OnChangedHexaSelection -= OnChangedHexaSelection;
        }

        private void OnGridTileClicked(GameObject tileObject, int index)
        {
            Debug.Log($"[{this.GetType().Name}][SUB] OnGridTileClicked Change to Upgrade, if possible.");

            var pIndex = 0;

            HexaTile tile = Storage.HexaGame.HexaTuples[pIndex].board[index];

            if (tile.IsEmpty())
            {
                return;
            }

            PlayScreenState.SelectedGridIndex = index;

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayTileUpgrade);
        }

        private void OnNextPlayerTurn(byte playerTurn)
        {
            Debug.Log("PlaySelectSubState > OnNextPlayerTurn");
            OnChangedHexaSelection(Storage.HexaGame.UnboundTileOffers);
        }

        private void OnChangedHexaSelection(List<byte> hexaSelection)
        {
            _scvSelection.Clear();

            for (int i = 0; i < hexaSelection.Count; i++)
            {
                var p = hexaSelection[i];
                var tileOffer = GameConfig.TILE_COSTS[p];

                var tileCard = PlayScreenState.TileCardElement.Instantiate();

                tileCard.Q<Label>("LblTileName").text = tileOffer.TileToBuy.TileType.ToString() + "(Norm)";

                tileCard.Q<Label>("LblRound").text = HelperUI.TileRoundDescription(tileOffer.TileToBuy);
                tileCard.Q<Label>("LblManaCost").text = "1";

                var velTileImage = tileCard.Q<VisualElement>("VelTileImage");
                switch (tileOffer.TileToBuy.TileType)
                {
                    case TileType.Home:
                        velTileImage.style.backgroundImage = new StyleBackground(PlayScreenState.TileHome);
                        break;

                    case TileType.Grass:
                        velTileImage.style.backgroundImage = new StyleBackground(PlayScreenState.TileGrass);
                        break;

                    case TileType.Water:
                        velTileImage.style.backgroundImage = new StyleBackground(PlayScreenState.TileWater);
                        break;

                    case TileType.Tree:
                        velTileImage.style.backgroundImage = new StyleBackground(PlayScreenState.TileTrees);
                        break;

                    case TileType.Mountain:
                        velTileImage.style.backgroundImage = new StyleBackground(PlayScreenState.TileMountain);
                        break;

                    case TileType.Cave:
                        velTileImage.style.backgroundImage = new StyleBackground(PlayScreenState.TileCave);
                        break;

                    case TileType.Desert:
                        velTileImage.style.backgroundImage = new StyleBackground(PlayScreenState.TileDesert);
                        break;
                }

                PlayTileSelectSubState.DisplayManaBottle(tileCard, Storage.HexaGame.CurrentPlayer);

                var number = new byte();
                number = (byte)i;
                tileCard.AddManipulator(new Clickable(() => OnTileCardClicked(number)));

                _scvSelection.Add(tileCard);
            }

            _lblActionInfo.text = $"{_scvSelection.Children().Count()}/{Storage.HexaGame.SelectBase} Tile(s) available";
        }

        private void OnTileCardClicked(byte index)
        {
            Debug.Log($"OnTileCardClicked: index {index}");
            PlayScreenState.SelectedCardIndex = index;

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayTileSelect);
        }
    }
}