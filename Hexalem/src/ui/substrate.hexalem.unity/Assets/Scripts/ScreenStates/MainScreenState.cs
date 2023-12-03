using Substrate.Hexalem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Timers;
using UnityEngine;
using UnityEngine.UIElements;
using static Assets.Scripts.GameEventManager;

namespace Assets.Scripts.ScreenStates
{
    public class MainScreenState : ScreenBaseState
    {
        private VisualElement _bottomBound;
        private Label? currentHelperLabel;

        public MainScreenState(FlowController _flowController)
            : base(_flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            // filler is to avoid camera in the ui
            var topFiller = FlowController.VelContainer.Q<VisualElement>("VelTopFiller");
            topFiller.style.backgroundColor = GameConstant.ColorDark;

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/MainScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);

            var topBound = instance.Q<VisualElement>("TopBound");
            var list = topBound.Query<VisualElement>("VelResourceElement");

            // add container
            FlowController.VelContainer.Add(instance);

            FlowController.VelContainer.Q<Label>("LblResourceWater").text = "100";
            //FlowController.ChangeScreenSubState(ScreenState.MainScreen, ScreenSubState.Dashboard);

            GameEventManager.OnRessourcesChangedDelegate += OnRessourcesChanged;
            GameEventManager.OnVisualGameHelperChangedDelegate += OnDisplayHelper;
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

            if (currentHelperLabel != null) return; // This is really bad, but let's keep going and a queue later...

            switch (state)
            {
                case StateType.GameStarted:
                    currentHelperLabel = FlowController.VelContainer.Q<Label>("LblGameStarted");
                    
                    break;
                case StateType.CalcReward:
                    currentHelperLabel = FlowController.VelContainer.Q<Label>("LblCalcReward");
                    break;
            }

            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                currentHelperLabel.style.display = DisplayStyle.Flex;
                //FlowController.Invoke(nameof(DisableHelper), (float)nbMillisecond / 1000);
            });

            timer.Elapsed += DisableHelper;
            timer.Start();
        }

        private void DisableHelper(object sender, ElapsedEventArgs e)
        {
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                currentHelperLabel.style.display = DisplayStyle.None;
            });
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");
        }

        public enum StateType
        {
            GameStarted,
            CalcReward
        }
    }
}