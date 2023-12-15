using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class HistoryScreen : ScreenBaseState
    {
        private Button _btnCancel;
        private TemplateContainer _instance;

        public HistoryScreen(FlowController flowController) : base(flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/GameHistoryScreenUI");
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