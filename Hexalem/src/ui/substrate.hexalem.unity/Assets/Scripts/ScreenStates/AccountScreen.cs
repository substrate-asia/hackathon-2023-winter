using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class AccountScreen : ScreenBaseState
    {

        private Button _btnCancel;
        private TemplateContainer _instance;

        public AccountScreen(FlowController flowController) : base(flowController) {
        }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/AccountScreenUI");
            _instance = visualTreeAsset.Instantiate();

            _btnCancel = _instance.Q<Button>("BtnBack");

            _btnCancel.RegisterCallback((ClickEvent evt) =>
            {
                Debug.Log($"[Cancel] Go back to login screen");
                FlowController.ChangeScreenState(ScreenState.StartScreen);
            });

            FlowController.VelContainer.Add(_instance);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");
        }
    }
}