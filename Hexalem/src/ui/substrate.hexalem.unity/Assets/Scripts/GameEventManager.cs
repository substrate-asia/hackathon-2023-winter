using Assets.Scripts;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts
{
    public class GameEventManager : Singleton<GameEventManager>
    {
        public delegate void OnStartNewGame();
        public static event OnStartNewGame startNewGameDelegate;

        public void OnStartGame()
        {
            Debug.Log("GameEventManager > OnStartGame");
            startNewGameDelegate();
        }
    }
}