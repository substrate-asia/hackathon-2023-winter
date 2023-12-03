using UnityEngine;
using UnityEngine.UIElements;


namespace Assets.Scripts
{
    internal class ChooseScreen : ScreenBaseState
    {
        private Button _btnTraining;
        private Button _btnVsAi;
        private Button _btnPvp;
        private Button _btnCancel;
        private TemplateContainer _chooseInstance;

        public ChooseScreen(FlowController flowController) : base(flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[ChooseScreen] EnterState");

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/ChooseGameUI");
            _chooseInstance = visualTreeAsset.Instantiate();

            _btnTraining = _chooseInstance.Q<Button>("BtnSingleMode");
            _btnVsAi = _chooseInstance.Q<Button>("BtnAIMode");
            _btnPvp = _chooseInstance.Q<Button>("BtnPvpMode");
            _btnCancel = _chooseInstance.Q<Button>("BtnBack");

            _btnTraining.RegisterCallback((ClickEvent evt) =>
            {
                Debug.Log($"[Training] Start new game");
                FlowController.ChangeScreenState(ScreenState.MainScreen);

                //GameEventManager.OnStartGame("training");
                GameEventManager.OnStartGame("training");
            });

            _btnVsAi.RegisterCallback((ClickEvent evt) =>
            {
                Debug.Log($"[VsAI] Start new game");
                FlowController.ChangeScreenState(ScreenState.HistoryScreen);
            });

            _btnPvp.RegisterCallback((ClickEvent evt) =>
            {
                Debug.Log($"[PvP] Start new game");
                FlowController.ChangeScreenState(ScreenState.AccountScreen);
            });

            _btnCancel.RegisterCallback((ClickEvent evt) =>
            {
                Debug.Log($"[Cancel] Go back to login screen");
                FlowController.ChangeScreenState(ScreenState.StartScreen);
            });

            FlowController.VelContainer.Add(_chooseInstance);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            FlowController.VelContainer.Remove(_chooseInstance);
        }
    }
}