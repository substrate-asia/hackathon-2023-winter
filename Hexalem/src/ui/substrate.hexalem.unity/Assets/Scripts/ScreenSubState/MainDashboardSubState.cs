using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;
using System.Linq;

namespace Assets.Scripts.ScreenStates
{
    internal class MainDashboardSubState : ScreenBaseState
    {

        public VisualElement _velAvatarSmallElement;

        public MainScreenState MainScreenState => ParentState as MainScreenState;

        public MainDashboardSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.style.backgroundColor = GameConstant.ColorLightGrey;
            floatBody.Clear();

            TemplateContainer scrollViewElement = ElementInstance("UI/Elements/ScrollViewElement");
            floatBody.Add(scrollViewElement);
            var scrollView = scrollViewElement.Q<ScrollView>("ScvElement");

            TemplateContainer elementInstance = ElementInstance("UI/Frames/DashboardFrame");

            var messageBox = elementInstance.Q<Label>("LblMessageBox");
            messageBox.style.display = DisplayStyle.None;


            // add element
            scrollView.Add(elementInstance);

        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");

        }


    }
}