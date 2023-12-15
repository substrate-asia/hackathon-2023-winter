using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class StartScreen : ScreenBaseState
    {
        private Button _btnEnter;

        private Button _btnAlice;
        private Button _btnBob;
        private Button _btnCharlie;
        private Button _btnDave;

        public StartScreen(FlowController _flowController)
            : base(_flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/StartScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);

            _btnEnter = instance.Q<Button>("BtnEnter");
            _btnEnter.RegisterCallback<ClickEvent>(OnClickEnter);

            _btnAlice = instance.Q<Button>("BtnAlice");
            _btnAlice.RegisterCallback<ClickEvent>((accountType) => OnAccountClicked(AccountType.Alice));

            _btnBob = instance.Q<Button>("BtnBob");
            _btnBob.RegisterCallback<ClickEvent>((accountType) => OnAccountClicked(AccountType.Bob));

            _btnCharlie = instance.Q<Button>("BtnCharlie");
            _btnCharlie.RegisterCallback<ClickEvent>((accountType) => OnAccountClicked(AccountType.Charlie));

            _btnDave = instance.Q<Button>("BtnDave");
            _btnDave.RegisterCallback<ClickEvent>((accountType) => OnAccountClicked(AccountType.Dave));

            // initially select alice
            OnAccountClicked(AccountType.Alice);

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

        private void OnAccountClicked(AccountType accountType)
        {
            _btnAlice.style.backgroundColor = GameConstant.ColorUnselected;
            _btnBob.style.backgroundColor = GameConstant.ColorUnselected;
            _btnCharlie.style.backgroundColor = GameConstant.ColorUnselected;
            _btnDave.style.backgroundColor = GameConstant.ColorUnselected;

            switch (accountType)
            {
                case AccountType.Alice:
                    _btnAlice.style.backgroundColor = GameConstant.ColorSelected;
                    break;
                case AccountType.Bob:
                    _btnBob.style.backgroundColor = GameConstant.ColorSelected;
                    break;
                case AccountType.Charlie:
                    _btnCharlie.style.backgroundColor = GameConstant.ColorSelected;
                    break;
                case AccountType.Dave:
                    _btnDave.style.backgroundColor = GameConstant.ColorSelected;
                    break;
            }

            Network.ChangeAccount(accountType);
        }

    }
}