using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class StartScreen : ScreenBaseState
    {
        private Texture2D _portraitAlice;
        private Texture2D _portraitBob;
        private Texture2D _portraitCharlie;
        private Texture2D _portraitDave;

        private VisualElement _velPortrait;
        
        private Label _lblPlayerName;
        private Label _lblNodeType;

        public StartScreen(FlowController _flowController)
            : base(_flowController) 
        {
            _portraitAlice = Resources.Load<Texture2D>($"Images/alice_portrait");
            _portraitBob = Resources.Load<Texture2D>($"Images/bob_portrait");
            _portraitCharlie = Resources.Load<Texture2D>($"Images/charlie_portrait");
            _portraitDave = Resources.Load<Texture2D>($"Images/dave_portrait");
        }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/StartScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);

            _velPortrait = instance.Q<VisualElement>("VelPortrait");
           _lblPlayerName = instance.Q<Label>("LblPlayerName");

            var btnEnter = instance.Q<Button>("BtnEnter");
            btnEnter.RegisterCallback<ClickEvent>(OnEnterClicked);

            _lblNodeType = instance.Q<Label>("LblNodeType");
            _lblNodeType.RegisterCallback<ClickEvent>(OnNodeTypeClicked);

            // initially select alice
            Network.SetAccount(AccountType.Alice);
            _velPortrait.style.backgroundImage = _portraitAlice;

            Grid.OnSwipeEvent += OnSwipeEvent;

            // add container
            FlowController.VelContainer.Add(instance);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            Grid.OnSwipeEvent -= OnSwipeEvent;

            FlowController.VelContainer.RemoveAt(1);
        }

        private void OnSwipeEvent(Vector3 direction)
        {

            if (direction == Vector3.left)
            {
                switch (Network.CurrentAccountType)
                {
                    case AccountType.Alice:
                        Network.SetAccount(AccountType.Bob);
                        _lblPlayerName.text = AccountType.Bob.ToString();
                        _velPortrait.style.backgroundImage = _portraitBob;
                        break;
                    case AccountType.Bob:
                        Network.SetAccount(AccountType.Charlie);
                        _lblPlayerName.text = AccountType.Charlie.ToString();
                        _velPortrait.style.backgroundImage = _portraitCharlie;
                        break;
                    case AccountType.Charlie:
                        Network.SetAccount(AccountType.Dave);
                        _lblPlayerName.text = AccountType.Dave.ToString();
                        _velPortrait.style.backgroundImage = _portraitDave;
                        break;
                    case AccountType.Dave:
                    default:
                        break;
                }
            }
            else if (direction == Vector3.right)
            {
                switch (Network.CurrentAccountType)
                {
                    case AccountType.Bob:
                        Network.SetAccount(AccountType.Alice);
                        _lblPlayerName.text = AccountType.Alice.ToString();
                        _velPortrait.style.backgroundImage = _portraitAlice;
                        break;
                    case AccountType.Charlie:
                        Network.SetAccount(AccountType.Bob);
                        _lblPlayerName.text = AccountType.Bob.ToString();
                        _velPortrait.style.backgroundImage = _portraitBob;
                        break;
                    case AccountType.Dave:
                        Network.SetAccount(AccountType.Charlie);
                        _lblPlayerName.text = AccountType.Charlie.ToString();
                        _velPortrait.style.backgroundImage = _portraitCharlie;
                        break;
                    case AccountType.Alice:
                    default:
                        break;
                }
            }

        }

        private void OnEnterClicked(ClickEvent evt)
        {
            Debug.Log("Clicked enter button!");

            FlowController.ChangeScreenState(ScreenState.MainScreen);
        }

        private void OnNodeTypeClicked(ClickEvent evt)
        {
            Network.ToggleNodeType();
            _lblNodeType.text = Network.CurrentNodeType.ToString();
        }
    }
}