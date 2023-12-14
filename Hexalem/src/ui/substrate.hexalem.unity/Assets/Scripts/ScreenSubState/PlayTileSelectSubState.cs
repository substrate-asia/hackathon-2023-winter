using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using System.Collections.Generic;
using UnityEditor.MemoryProfiler;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayTileSelectSubState : ScreenBaseState
    {
        public PlayScreenState MainScreenState => ParentState as PlayScreenState;

        private Material _emptyMat;
        private Material _selectedMat;

        private VisualElement _velTileCardBox;

        private Button _btnActionTitle;
        private Button _btnActionCancel;

        public PlayTileSelectSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent)
        {
            _emptyMat = Resources.Load<Material>("Materials/empty");
            _selectedMat = Resources.Load<Material>("Materials/emptySelected");
        }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var BootomPadding = FlowController.VelContainer.Q<VisualElement>("BottomPadding");
            BootomPadding.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Elements/BottomTileSelectElement");

            _velTileCardBox = elementInstance.Q<VisualElement>("VelTileCardBox");

            _btnActionTitle = elementInstance.Q<Button>("BtnActionTitle");
            _btnActionTitle.SetEnabled(false);
            _btnActionTitle.RegisterCallback<ClickEvent>(OnActionClicked);

            _btnActionCancel = elementInstance.Q<Button>("BtnActionCancel");
            _btnActionCancel.RegisterCallback<ClickEvent>(OnCancelClicked);

            // add element
            BootomPadding.Add(elementInstance);
            // avoid raycast through bottom bound UI
            Grid.RegisterBottomBound();

            UpdateTileSelection();

            Grid.OnGridTileClicked += OnGridTileClicked;
            Storage.OnChangedHexaSelection += OnChangedHexaSelection;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            Grid.OnGridTileClicked -= OnGridTileClicked;
            Storage.OnChangedHexaSelection -= OnChangedHexaSelection;
        }

        private void OnGridTileClicked(GameObject tileObject, int index)
        {
            var pIndex = 0;

            HexaTile tile = Storage.HexaGame.HexaTuples[pIndex].board[index];

            if (!tile.IsEmpty())
            {
                return;
            }

            if (!Storage.HexaGame.CanChooseAndPlace((byte)pIndex, MainScreenState.SelectedCardIndex, index))
            {
                Debug.Log($"Bad Chose & Place player {pIndex}, selection index {MainScreenState.SelectedCardIndex} and grid index {index}");
                return;
            }

            if (MainScreenState.SelectedGridIndex < 0)
            {
                MainScreenState.SelectedGridIndex = index;
                Renderer renderer = tileObject.GetComponent<Renderer>();
                renderer.material = new Material(_selectedMat);
                _btnActionTitle.SetEnabled(true);
            }
            else if (MainScreenState.SelectedGridIndex == index)
            {
                Grid.PlayerGrid.transform.GetChild(MainScreenState.SelectedGridIndex).GetChild(0).GetComponent<Renderer>().material = _emptyMat;
                MainScreenState.SelectedGridIndex = -1;
                _btnActionTitle.SetEnabled(false);
            }
            else
            {
                Grid.PlayerGrid.transform.GetChild(MainScreenState.SelectedGridIndex).GetChild(0).GetComponent<Renderer>().material = _emptyMat;
                MainScreenState.SelectedGridIndex = index;
                Renderer renderer = tileObject.GetComponent<Renderer>();
                renderer.material = new Material(_selectedMat);
                _btnActionTitle.SetEnabled(true);
            }
        }

        private void OnActionClicked(ClickEvent evt)
        {
            if (!Storage.UpdateHexalem)
            {
                MainScreenState.Blocknumber++;

                var result = Game.ChooseAndPlace(MainScreenState.Blocknumber, (HexaGame)Storage.HexaGame.Clone(), (byte)MainScreenState.PlayerIndex, MainScreenState.SelectedCardIndex, MainScreenState.SelectedGridIndex);

                if (result == null)
                {
                    return;
                }

                Storage.SetTrainGame(result, MainScreenState.PlayerIndex);
            }
            else
            {
                // TODO ADD On chain action ...
            }
        }

        private void OnCancelClicked(ClickEvent evt)
        {
            if (MainScreenState.SelectedGridIndex > -1)
            {
                Grid.PlayerGrid.transform.GetChild(MainScreenState.SelectedGridIndex).GetChild(0).GetComponent<Renderer>().material = _emptyMat;
                MainScreenState.SelectedGridIndex = -1;
            }
            MainScreenState.SelectedCardIndex = -1;

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        private void OnChangedHexaSelection(List<byte> hexaSelection)
        {
            if (MainScreenState.SelectedGridIndex > -1) {
                Grid.PlayerGrid.transform.GetChild(MainScreenState.SelectedGridIndex).GetChild(0).GetComponent<Renderer>().material = _emptyMat;
                MainScreenState.SelectedGridIndex = -1;
            }

            MainScreenState.SelectedCardIndex = -1;
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        private void UpdateTileSelection()
        {
            var tileCard = MainScreenState.TileCardElement.Instantiate();

            var selectTile = GameConfig.TILE_COSTS[Storage.HexaGame.UnboundTileOffers[MainScreenState.SelectedCardIndex]];

            tileCard.Q<Label>("LblTileName").text = selectTile.TileToBuy.TileType.ToString() + "(Norm)";

            tileCard.Q<Label>("LblRoundPre").text = "(+1";
            tileCard.Q<Label>("LblManaCost").text = "1";

            var velTileImage = tileCard.Q<VisualElement>("VelTileImage");
            switch (selectTile.TileToBuy.TileType)
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

            _velTileCardBox.Add(tileCard);

            
        }
    }
}