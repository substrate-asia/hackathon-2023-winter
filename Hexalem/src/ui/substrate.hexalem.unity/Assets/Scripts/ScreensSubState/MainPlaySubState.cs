using Substrate.Hexalem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Assets.Scripts.ScreenStates.MainScreenState;
using System.Timers;
using UnityEngine.UIElements;
using UnityEngine;
using Assets.Scripts.ScreenStates;
using UnityEngine.UI;

namespace Assets.Scripts.ScreensSubState
{
    public class MainPlaySubState : ScreenBaseState
    {

        public MainScreenState MainScreenState => ParentState as MainScreenState;
        TemplateContainer elementInstance;

        private Label _currentHelperLabel;
        private VisualElement _toggleZoom;
        private bool _isZoomed;

        public MainPlaySubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public enum StateType
        {
            GameStarted,
            CalcReward,
            TileUpgradeSucceed
        }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.style.backgroundColor = GameConstant.ColorTransparent;
            floatBody.Clear();

            TemplateContainer scrollViewElement = ElementInstance("UI/Elements/ScrollViewElement");
            floatBody.Add(scrollViewElement);

            var scrollView = scrollViewElement.Q<ScrollView>("ScvElement");

            elementInstance = ElementInstance("UI/Frames/PlayFrame");

            // add element
            scrollView.Add(elementInstance);

            CallZoom();

            GameEventManager.RessourcesChangedDelegate += OnRessourcesChanged;
            GameEventManager.VisualGameDelegate += OnDisplayHelper;
            GameEventManager.TileDetailsHandlerDelegate += OnTileDetails;
        }

        public void CallZoom()
        {
            _toggleZoom = elementInstance.Q<VisualElement>("ToggleZoom");
            _isZoomed = false;
            var zoomLabel = elementInstance.Q<Label>("ToggleZoomLabel");

            _toggleZoom.RegisterCallback((ClickEvent ev) =>
            {
                GameEventManager.GetInstance().OnZoom(!_isZoomed);
                _isZoomed = !_isZoomed;
                zoomLabel.text = _isZoomed ? "-" : "+";
            });
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            GameEventManager.RessourcesChangedDelegate -= OnRessourcesChanged;
            GameEventManager.VisualGameDelegate -= OnDisplayHelper;
            GameEventManager.TileDetailsHandlerDelegate -= OnTileDetails;
        }

        public void OnTileDetails(bool show, (int, int) coords, HexaTile tile, bool canUpgrade)
        {
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                var tileDetailsContainer = FlowController.VelContainer.Q<VisualElement>("VelTileDetails");

                if (show)
                {
                    Debug.Log("Display tile details");
                    tileDetailsContainer.style.display = DisplayStyle.Flex;

                    tileDetailsContainer.Q<Label>("TitleText").text = "blabla";
                    tileDetailsContainer.Q<Label>("BodyText").text = $"Tile type : {tile.TileType} / Tile rarity {tile.TileRarity} / Tile pattern {tile.TilePattern}";
                }
                else
                {
                    Debug.Log("Hide tile details");
                    tileDetailsContainer.style.display = DisplayStyle.None;
                }

                var btnUpgradeTile = tileDetailsContainer.Q<UnityEngine.UIElements.Button>("UpgradeTile");
                if (canUpgrade)
                {
                    tileDetailsContainer.Q<UnityEngine.UIElements.Button>("UpgradeTile").RegisterCallback((ClickEvent ev) =>
                    {
                        GameEventManager.GetInstance().OnUpgradeTile(coords);
                    });
                } else
                {
                    btnUpgradeTile.style.opacity = 0.4f;
                }
            });
        }

        public void OnRessourcesChanged(HexaPlayer player)
        {
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                FlowController.VelContainer.Q<Label>("LblResourceWater").text = player[RessourceType.Water].ToString();
                FlowController.VelContainer.Q<Label>("LblResourceMana").text = player[RessourceType.Mana].ToString();
                FlowController.VelContainer.Q<Label>("LblResourceHuman").text = player[RessourceType.Humans].ToString();
                FlowController.VelContainer.Q<Label>("LblResourceWood").text = player[RessourceType.Wood].ToString();
                FlowController.VelContainer.Q<Label>("LblResourceStone").text = player[RessourceType.Stone].ToString();
                FlowController.VelContainer.Q<Label>("LblResourceGold").text = player[RessourceType.Gold].ToString();
                FlowController.VelContainer.Q<Label>("LblResourceFood").text = player[RessourceType.Food].ToString();
            });
        }

        /// <summary>
        /// Display helper on screen during <paramref name="nbMillisecond"/> milliseconds
        /// </summary>
        /// <param name="nbMillisecond"></param>
        /// <param name="state"></param>
        public void OnDisplayHelper(int nbMillisecond, StateType state)
        {
            var timer = new Timer();
            timer.Interval = nbMillisecond;

            if (_currentHelperLabel != null) return; // This is really bad, but let's keep going and a queue later...

            switch (state)
            {
                case StateType.GameStarted:
                    _currentHelperLabel = elementInstance.Q<Label>("LblGameStarted");
                    break;
                case StateType.CalcReward:
                    _currentHelperLabel = elementInstance.Q<Label>("LblCalcReward");
                    break;
                case StateType.TileUpgradeSucceed:
                    _currentHelperLabel = elementInstance.Q<Label>("LblTileUpgraded");
                    break;
            }

            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                _currentHelperLabel.style.display = DisplayStyle.Flex;
            });

            timer.Elapsed += DisableHelper;
            timer.Start();
        }

        private void DisableHelper(object sender, ElapsedEventArgs e)
        {
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                if(_currentHelperLabel != null)
                {
                    _currentHelperLabel.style.display = DisplayStyle.None;
                    _currentHelperLabel = null;
                }
            });
        }
    }
}
