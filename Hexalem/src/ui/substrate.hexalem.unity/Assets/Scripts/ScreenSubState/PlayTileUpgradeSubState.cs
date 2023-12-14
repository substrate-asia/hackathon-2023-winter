using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayTileUpgradeSubState : ScreenBaseState
    {
        public PlayScreenState MainScreenState => ParentState as PlayScreenState;

        private VisualElement _velTileCardBox;

        private Label _lblActionTitle;
        private Label _lblActionCancel;

        public PlayTileUpgradeSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Frames/PlayTileUpgradeFrame");

            _velTileCardBox = elementInstance.Q<VisualElement>("VelTileCardBox");

            _lblActionTitle = elementInstance.Q<Label>("LblActionTitle");
            var canUpgrade = Storage.HexaGame.CanUpgrade((byte)MainScreenState.PlayerIndex, MainScreenState.SelectedGridIndex);
            _lblActionTitle.SetEnabled(canUpgrade);
            _lblActionTitle.RegisterCallback<ClickEvent>(OnActionClicked);


            _lblActionCancel = elementInstance.Q<Label>("LblActionCancel");
            _lblActionCancel.RegisterCallback<ClickEvent>(OnCancelClicked);

            // add element
            floatBody.Add(elementInstance);
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
            MainScreenState.SelectedGridIndex = -1;

            FlowController.ChangeScreenSubState(ScreenState.PlayScreen, ScreenSubState.PlaySelect);
        }

        private void UpdateTileSelection()
        {
            var tileCard = MainScreenState.TileCardElement.Instantiate();

            var selectTile = (HexaTile)Storage.Board(MainScreenState.PlayerIndex)[MainScreenState.SelectedGridIndex];

            tileCard.Q<Label>("LblTileName").text = selectTile.TileType.ToString() + "(" + HelperUI.TileLevelName(selectTile.TileLevel) + ")";

            tileCard.Q<Label>("LblRoundPre").text = "(+1";
            tileCard.Q<Label>("LblManaCost").text = "1";

            var velTileImage = tileCard.Q<VisualElement>("VelTileImage");
            switch (selectTile.TileType)
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

        private void OnActionClicked(ClickEvent evt)
        {
            if (!Storage.UpdateHexalem)
            {
                MainScreenState.Blocknumber++;
                var result = Game.Upgrade(MainScreenState.Blocknumber, (HexaGame)Storage.HexaGame.Clone(), (byte)MainScreenState.PlayerIndex, MainScreenState.SelectedGridIndex);

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
    }
}