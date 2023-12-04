using Substrate.Hexalem;
using UnityEngine;
using static Assets.Scripts.ScreensSubState.MainPlaySubState;

namespace Assets.Scripts
{
    public class GameEventManager : Singleton<GameEventManager>
    {
        public delegate void OnStartNewGame(string gameType);
        public static event OnStartNewGame StartNewGameDelegate;

        public void OnStartGame(string gameType)
        {
            Debug.Log("GameEventManager > OnStartGame");
            StartNewGameDelegate(gameType);
        }

        public delegate void RessourcesChangedHandler(HexaPlayer player);
        public event RessourcesChangedHandler OnRessourcesChangedDelegate;

        public void OnRessourcesChanged(HexaPlayer player)
        {
            Debug.Log("GameEventManager > OnRessourcesChanged");
            OnRessourcesChangedDelegate(player);
        }

        public delegate void VisualGameHelperHandler(int nbMillisecond, StateType state);
        public event VisualGameHelperHandler OnVisualGameHelperChangedDelegate;

        public void OnVisualGameHelperChanged(int nbMillisecond, StateType state)
        {
            Debug.Log("GameEventManager > OnVisualGameHelperChanged");
            OnVisualGameHelperChangedDelegate(nbMillisecond, state);
        }

    }
}