using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class MainScreenState : ScreenBaseState
    {
        private VisualElement _bottomBound;

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

            //FlowController.ChangeScreenSubState(ScreenState.MainScreen, ScreenSubState.Dashboard);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

        }

    }
}