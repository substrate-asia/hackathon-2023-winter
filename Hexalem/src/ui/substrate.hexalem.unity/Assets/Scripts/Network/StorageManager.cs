using Assets.Scripts;
using Substrate.Hexalem.Engine;
using Substrate.Hexalem.Integration.Model;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using Substrate.Integration.Helper;
using Substrate.Integration.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using UnityEngine;

public class StorageManager : Singleton<StorageManager>
{
    public delegate void NextBlocknumberHandler(uint blocknumber);
    public event NextBlocknumberHandler OnNextBlocknumber;

    public delegate void HexaBoardChangedHandler(HexaBoard HexaBoard);
    public event HexaBoardChangedHandler OnChangedHexaBoard;

    public delegate void NextPlayerTurnHandler(byte playerTurn);
    public event NextPlayerTurnHandler OnNextPlayerTurn;

    public NetworkManager Network => NetworkManager.GetInstance();

    public uint BlockNumber { get; private set; }

    public AccountInfoSharp AccountInfo { get; private set; }

    public HexaBoard HexaBoard { get; private set; }

    public HexaGame HexaGame { get; private set; }
    public bool UpdateHexalem { get; internal set; }

    /// <summary>
    /// Awake is called when the script instance is being loaded
    /// </summary>
    protected override void Awake()
    {
        base.Awake();
        //Your code goes here
    }

    /// <summary>
    /// Start is called before the first frame update
    /// </summary>
    private void Start()
    {
        InvokeRepeating(nameof(UpdatedBaseData), 4.0f, 10.0f);
    }

    /// <summary>
    /// Update is called once per frame
    /// </summary>
    private void Update()
    {
        /// Your code goes here
    }

    public bool CanPollStorage()
    {
        if (Network.Client == null)
        {
            Debug.LogError($"[StorageManager] Client is null");
            return false;
        }

        if (!Network.Client.IsConnected)
        {
            Debug.Log($"[StorageManager] Client is not connected");
            return false;
        }

        return true;
    }

    private async void UpdatedBaseData()
    {
        if (!CanPollStorage())
        {
            return;
        }

        var blockNumber = await Network.Client.GetBlocknumberAsync(CancellationToken.None);

        if (blockNumber == null || BlockNumber >= blockNumber)
        {
            return;
        }

        BlockNumber = blockNumber.Value;
        OnNextBlocknumber?.Invoke(blockNumber.Value);

        Debug.Log($"[StorageManager] Block {BlockNumber}");

        if (Network.Client.Account == null)
        {
            Debug.Log($"[StorageManager] Client account not set");
            return;
        }

        AccountInfo = await Network.Client.GetAccountAsync(CancellationToken.None);

        // don't update hexalem on chain informations ...
        if (!UpdateHexalem)
        {
            return;
        }

        var myBoard = await Network.Client.GetBoardAsync(Network.Client.Account.Value, CancellationToken.None);
        var playerGame = myBoard != null ? await Network.Client.GetGameAsync(myBoard.GameId, CancellationToken.None) : null;
        if (myBoard == null || playerGame == null)
        {
            HexaGame = null;
            return;
        }
        var hexaBoard = HexalemWrapper.GetHexaBoard(myBoard);
        // check for the event
        ChangedHexaBoard(HexaBoard, hexaBoard);
        HexaBoard = hexaBoard;

        var playerBoards = new List<BoardSharp>();
        foreach (var player in playerGame.Players)
        {
            var playerBoard = await Network.Client.GetBoardAsync(player, CancellationToken.None);
            if (playerBoard != null)
            {
                playerBoards.Add(playerBoard);
            }
        }
        var hexaGame = HexalemWrapper.GetHexaGame(playerGame, playerBoards.ToArray());

        // check for the event
        NextPlayerTurn(HexaGame, hexaGame);
        HexaGame = hexaGame;
    }

    public void ChangedHexaBoard(HexaBoard oldBoard, HexaBoard newBoard)
    {
        if (newBoard == null)
        {
            return;
        }

        if (oldBoard == null || !oldBoard.IsSame(newBoard))
        {
            OnChangedHexaBoard?.Invoke(newBoard);
        }
    }

    public void NextPlayerTurn(HexaGame oldGame, HexaGame newGame)
    {
        if (newGame == null)
        {
            return;
        }

        if (oldGame == null || oldGame.PlayerTurn != newGame.PlayerTurn)
        {
            OnNextPlayerTurn?.Invoke(newGame.PlayerTurn);
        }
    }

    public void SetTrainStates(HexaGame hexaGame)
    {
        // check for the event
        NextPlayerTurn(HexaGame, hexaGame);
        HexaGame = hexaGame;
    }

    public void SetTrainStates(HexaBoard hexaBoard)
    {
        // check for the event
        ChangedHexaBoard(HexaBoard, hexaBoard);
        HexaBoard = hexaBoard;
    }
}