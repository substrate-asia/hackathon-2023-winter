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

namespace Assets.Scripts.ScreensSubState
{
    public class MainPlaySubState : ScreenBaseState
    {

        public MainScreenState MainScreenState => ParentState as MainScreenState;
        TemplateContainer elementInstance;
        private Label? currentHelperLabel = null;

        public MainPlaySubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public enum StateType
        {
            GameStarted,
            CalcReward
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

            GameEventManager.OnRessourcesChangedDelegate += OnRessourcesChanged;
            GameEventManager.OnVisualGameHelperChangedDelegate += OnDisplayHelper;
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

            GameEventManager.OnRessourcesChangedDelegate -= OnRessourcesChanged;
            GameEventManager.OnVisualGameHelperChangedDelegate -= OnDisplayHelper;
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
                    currentHelperLabel = elementInstance.Q<Label>("LblGameStarted");
                    break;
                case StateType.CalcReward:
                    currentHelperLabel = elementInstance.Q<Label>("LblCalcReward");
                    break;
            }

            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                currentHelperLabel.style.display = DisplayStyle.Flex;
            });

            timer.Elapsed += DisableHelper;
            timer.Start();
        }

        private void DisableHelper(object sender, ElapsedEventArgs e)
        {
            UnityMainThreadDispatcher.Instance().Enqueue(() =>
            {
                currentHelperLabel.style.display = DisplayStyle.None;
                currentHelperLabel = null;
            });
        }
    }
}
