using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayTileSelectSubState : ScreenBaseState
    {
        public PlayScreenState PlayScreenState => ParentState as PlayScreenState;

        private Material _emptyMat;
        private Material _selectedMat;

        private VisualElement _velTileCardBox;
        private VisualElement _imgManaEnough;
        private VisualElement _imgManaNotEnough;

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

            ClearTileSelection();
        }

        private void OnGridTileClicked(GameObject tileObject, int index)
        {
            var pIndex = 0;

            HexaTile tile = Storage.HexaGame.HexaTuples[pIndex].board[index];

            if (!tile.IsEmpty())
            {
                return;
            }

            // No selections ..
            if (Network.Client.ExtrinsicManager.PreInblock.Any())
            {
                Debug.Log("Still some transactions pre in block.");
                return;
            }

            if (!Storage.HexaGame.CanChooseAndPlace((byte)pIndex, PlayScreenState.SelectedCardIndex, index))
            {
                Debug.Log($"Bad Chose & Place player {pIndex}, selection index {PlayScreenState.SelectedCardIndex} and grid index {index}");
                return;
            }

            if (PlayScreenState.SelectedGridIndex < 0)
            {
                PlayScreenState.SelectedGridIndex = index;
                Renderer renderer = tileObject.GetComponent<Renderer>();
                renderer.material = new Material(_selectedMat);
                _btnActionTitle.SetEnabled(true);
            }
            else if (PlayScreenState.SelectedGridIndex == index)
            {
                Grid.PlayerGrid.transform.GetChild(PlayScreenState.SelectedGridIndex).GetChild(0).GetComponent<Renderer>().material = _emptyMat;
                PlayScreenState.SelectedGridIndex = -1;
                _btnActionTitle.SetEnabled(false);
            }
            else
            {
                Grid.PlayerGrid.transform.GetChild(PlayScreenState.SelectedGridIndex).GetChild(0).GetComponent<Renderer>().material = _emptyMat;
                PlayScreenState.SelectedGridIndex = index;
                Renderer renderer = tileObject.GetComponent<Renderer>();
                renderer.material = new Material(_selectedMat);
                _btnActionTitle.SetEnabled(true);
            }
        }

        private async void OnActionClicked(ClickEvent evt)
        {
            _btnActionTitle.SetEnabled(false);

            if (!Storage.UpdateHexalem)
            {
                var result = Game.ChooseAndPlace(Storage.MockBlockNumber, (HexaGame)Storage.HexaGame.Clone(), (byte)PlayScreenState.PlayerIndex, PlayScreenState.SelectedCardIndex, PlayScreenState.SelectedGridIndex);

                if (result == null)
                {
                    _btnActionTitle.SetEnabled(true);
                    return;
                }

                Storage.SetTrainGame(result, PlayScreenState.PlayerIndex);
            }
            else if (!Network.Client.ExtrinsicManager.PreInblock.Any())
            {
                var subscriptionId = await Network.Client.PlayAsync(Network.Client.Account, (byte)PlayScreenState.SelectedGridIndex, (byte)PlayScreenState.SelectedCardIndex, 2, CancellationToken.None);
                if (subscriptionId == null)
                {
                    _btnActionTitle.SetEnabled(true);
                    return;
                }

                Debug.Log($"Extrinsic[PlayAsync] submited: {subscriptionId}");
                FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayWaiting);
            }
        }

        public void ClearTileSelection()
        {
            if (PlayScreenState.SelectedGridIndex > -1)
            {
                Grid.PlayerGrid.transform.GetChild(PlayScreenState.SelectedGridIndex).GetChild(0).GetComponent<Renderer>().material = _emptyMat;
                PlayScreenState.SelectedGridIndex = -1;
            }

            PlayScreenState.SelectedCardIndex = -1;
        }

        private void OnCancelClicked(ClickEvent evt)
        {
            if (PlayScreenState.SelectedGridIndex > -1)
            {
                Grid.PlayerGrid.transform.GetChild(PlayScreenState.SelectedGridIndex).GetChild(0).GetComponent<Renderer>().material = _emptyMat;
                PlayScreenState.SelectedGridIndex = -1;
            }
            PlayScreenState.SelectedCardIndex = -1;

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        private void OnChangedHexaSelection(List<byte> hexaSelection)
        {
            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        private void UpdateTileSelection()
        {
            var tileCard = PlayScreenState.TileCardElement.Instantiate();

            var selectTile = GameConfig.TILE_COSTS[Storage.HexaGame.UnboundTileOffers[PlayScreenState.SelectedCardIndex]];

            tileCard.Q<Label>("LblTileName").text = selectTile.TileToBuy.TileType.ToString() + "(Norm)";

            tileCard.Q<Label>("LblRoundPre").text = "(+1";
            tileCard.Q<Label>("LblManaCost").text = "1";

            var velTileImage = tileCard.Q<VisualElement>("VelTileImage");
            switch (selectTile.TileToBuy.TileType)
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

            DisplayManaBottle(tileCard, Storage.HexaGame.CurrentPlayer);

            _velTileCardBox.Add(tileCard);
        }

        public static void DisplayManaBottle(TemplateContainer tileCard, HexaPlayer player)
        {
            var imgManaEnough = tileCard.Q<VisualElement>("ImgManaEnough");
            var imgManaNotEnough = tileCard.Q<VisualElement>("ImgManaNotEnough");

            if (player[RessourceType.Mana] > 0) // Change with HaveEnoughRessource or smth similar
            {
                imgManaEnough.style.display = DisplayStyle.Flex;
                imgManaNotEnough.style.display = DisplayStyle.None;
            }
            else
            {
                imgManaEnough.style.display = DisplayStyle.None;
                imgManaNotEnough.style.display = DisplayStyle.Flex;
            }
        }
    }
}