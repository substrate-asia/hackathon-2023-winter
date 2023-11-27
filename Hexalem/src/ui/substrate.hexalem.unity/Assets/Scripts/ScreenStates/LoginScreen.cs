using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class LoginScreen : ScreenBaseState
    {
        private Button _btnEnter;

        public LoginScreen(FlowController _flowController)
            : base(_flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/LoginScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);

            _btnEnter = instance.Q<Button>("BtnEnter");
            _btnEnter.RegisterCallback<ClickEvent>(OnClickEnter);

            // add container
            FlowController.VelContainer.Add(instance);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            FlowController.VelContainer.RemoveAt(1);
        }

        private void OnClickEnter(ClickEvent evt)
        {
            Debug.Log("Clicked enter button!");

            FlowController.ChangeScreenState(ScreenState.MainScreen);
        }

    }
}