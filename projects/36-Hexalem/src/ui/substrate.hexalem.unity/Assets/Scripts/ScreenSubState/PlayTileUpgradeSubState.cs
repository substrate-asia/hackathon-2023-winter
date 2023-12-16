using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using System.Linq;
using System.Threading;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayTileUpgradeSubState : ScreenBaseState
    {
        public PlayScreenState PlayScreenState => ParentState as PlayScreenState;

        private VisualElement _velTileCardBox;

        private Button _btnActionTitle;
        private Button _btnActionCancel;

        public PlayTileUpgradeSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var BootomPadding = FlowController.VelContainer.Q<VisualElement>("BottomPadding");
            BootomPadding.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Elements/BottomTileUpgradeElement");

            _velTileCardBox = elementInstance.Q<VisualElement>("VelTileCardBox");

            _btnActionTitle = elementInstance.Q<Button>("BtnActionTitle");
            var canUpgrade = Storage.HexaGame.CanUpgrade((byte)PlayScreenState.PlayerIndex, PlayScreenState.SelectedGridIndex);
            _btnActionTitle.SetEnabled(canUpgrade);
            _btnActionTitle.RegisterCallback<ClickEvent>(OnActionClicked);

            _btnActionCancel = elementInstance.Q<Button>("BtnActionCancel");
            _btnActionCancel.RegisterCallback<ClickEvent>(OnCancelClicked);

            // add element
            BootomPadding.Add(elementInstance);
            // avoid raycast through bottom bound UI
            Grid.RegisterBottomBound();

            UpdateTileSelection();
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");
        }

        private void OnCancelClicked(ClickEvent evt)
        {
            PlayScreenState.SelectedGridIndex = -1;

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        private void UpdateTileSelection()
        {
            var tileCard = PlayScreenState.TileCardElement.Instantiate();

            var selectTile = (HexaTile)Storage.Board(PlayScreenState.PlayerIndex)[PlayScreenState.SelectedGridIndex];

            tileCard.Q<Label>("LblTileName").text = selectTile.TileType.ToString() + "(" + HelperUI.TileLevelName(selectTile.TileLevel) + ")";

            tileCard.Q<Label>("LblRoundPre").text = "(+1";
            tileCard.Q<Label>("LblManaCost").text = "1";

            var velTileImage = tileCard.Q<VisualElement>("VelTileImage");
            switch (selectTile.TileType)
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

            _velTileCardBox.Add(tileCard);
        }

        private async void OnActionClicked(ClickEvent evt)
        {
            _btnActionTitle.SetEnabled(false);

            if (!Storage.UpdateHexalem)
            {
                var result = Game.Upgrade(Storage.MockBlockNumber, (HexaGame)Storage.HexaGame.Clone(), (byte)PlayScreenState.PlayerIndex, PlayScreenState.SelectedGridIndex);

                if (result == null)
                {
                    _btnActionTitle.SetEnabled(true);
                    return;
                }

                Storage.SetTrainGame(result, PlayScreenState.PlayerIndex);
            }
            else if (!Network.Client.ExtrinsicManager.PreInblock.Any())
            {
                var subscriptionId = await Network.Client.UpgradeAsync(Network.Client.Account, (byte)PlayScreenState.SelectedCardIndex, 1, CancellationToken.None);
                if (subscriptionId == null)
                {
                    _btnActionTitle.SetEnabled(true);
                    return;
                }

                Debug.Log($"Extrinsic[UpgradeAsync] submited: {subscriptionId}");
                FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlayWaiting);
            }
        }
    }
}