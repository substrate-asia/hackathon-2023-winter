using Assets.Scripts.ScreenStates;
using System.Collections.Generic;
using System.Security.Cryptography;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    public enum ScreenState
    {
        StartScreen,
        MainScreen,
        PlayScreen,
    }

    public enum ScreenSubState
    {
        MainChoose,
        Play,
        PlaySelect,
        PlayTileSelect,
        PlayTileUpgrade,
        PlayNextTurn,
        PlayFinish,
        PlayWaiting
    }

    public class FlowController : MonoBehaviour
    {
        internal NetworkManager Network => NetworkManager.GetInstance();
        internal StorageManager Storage => StorageManager.GetInstance();

        internal readonly RandomNumberGenerator Random = RandomNumberGenerator.Create();

        public Vector2 ScrollOffset { get; set; }

        public CacheData CacheData { get; private set; }

        public VisualElement VelContainer { get; private set; }

        public ScreenState CurrentState { get; private set; }

        private ScreenBaseState _currentState;
        private ScreenBaseState _currentSubState;
        private readonly Dictionary<ScreenState, ScreenBaseState> _stateDictionary = new();
        private readonly Dictionary<ScreenState, Dictionary<ScreenSubState, ScreenBaseState>> _subStateDictionary = new();

        //internal Account TempAccount { get; set; }
        //internal FileStore TempFileStore { get; set; }

        internal string TempAccountName { get; set; } // TODO: remove this ....
        internal string TempAccountPassword { get; set; } // TODO: remove this ....
        internal string TempMnemonic { get; set; }  // TODO: remove this ....

        private void Awake()
        {
            CacheData = new CacheData();

            // Initialize states
            _stateDictionary.Add(ScreenState.StartScreen, new StartScreen(this));

            var mainScreen = new MainScreenState(this);
            _stateDictionary.Add(ScreenState.MainScreen, mainScreen);

            var mainScreenSubStates = new Dictionary<ScreenSubState, ScreenBaseState>
            {
                { ScreenSubState.MainChoose, new MainChooseSubState(this, mainScreen) },
                { ScreenSubState.Play, new MainPlaySubState(this, mainScreen) },
            };
            _subStateDictionary.Add(ScreenState.MainScreen, mainScreenSubStates);

            var playScreen = new PlayScreenState(this);
            _stateDictionary.Add(ScreenState.PlayScreen, playScreen);

            var playScreenSubStates = new Dictionary<ScreenSubState, ScreenBaseState>
            {
                { ScreenSubState.PlaySelect, new PlaySelectSubState(this, playScreen) },
                { ScreenSubState.PlayTileSelect, new PlayTileSelectSubState(this, playScreen) },
                { ScreenSubState.PlayTileUpgrade, new PlayTileUpgradeSubState(this, playScreen) },
                { ScreenSubState.PlayNextTurn, new PlayNextTurnSubState(this, playScreen) },
                { ScreenSubState.PlayFinish, new PlayFinishSubState(this, playScreen) },
                { ScreenSubState.PlayWaiting, new PlayWaitingSubState(this, playScreen) },
            };
            _subStateDictionary.Add(ScreenState.PlayScreen, playScreenSubStates);
        }

        /// <summary>
        /// Start is called before the first frame update
        /// </summary>
        private void Start()
        {
            var root = GetComponent<UIDocument>().rootVisualElement;
            VelContainer = root.Q<VisualElement>("VelContainer");

            if (VelContainer.childCount > 1)
            {
                Debug.Log("Plaese remove development work, before starting!");
                return;
            }

            // initialize the client in the network manager
            Network.InitializeClient();

            // call insital flow state
            ChangeScreenState(ScreenState.StartScreen);
        }

        /// <summary>
        /// Update is called once per frame
        /// </summary>
        private void Update()
        {
            // Method intentionally left empty.
        }

        /// <summary>
        /// Change the screen state
        /// </summary>
        /// <param name="newScreenState"></param>
        internal void ChangeScreenState(ScreenState newScreenState)
        {
            CurrentState = newScreenState;

            // exit current state if any
            _currentState?.ExitState();

            // change the state
            _currentState = _stateDictionary[newScreenState];

            // exit any active sub-state when changing the main state
            _currentSubState?.ExitState();
            _currentSubState = null;

            // enter current state
            _currentState.EnterState();
        }

        /// <summary>
        /// Change the sub state of the current screen state
        /// </summary>
        /// <param name="parentState"></param>
        /// <param name="newSubState"></param>
        internal void ChangeScreenSubState(ScreenState parentState, ScreenSubState newSubState)
        {
            if (_subStateDictionary.ContainsKey(parentState) && _subStateDictionary[parentState].ContainsKey(newSubState))
            {
                // exit current sub state if any
                _currentSubState?.ExitState();

                // change the sub state
                _currentSubState = _subStateDictionary[parentState][newSubState];

                // enter current sub state
                _currentSubState.EnterState();
            }
        }
    }
}