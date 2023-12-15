using Assets.Scripts;
using Substrate.Hexalem.Engine;
using Substrate.Hexalem.Integration.Model;
using Substrate.Integration.Helper;
using Substrate.Integration.Model;
using Substrate.NetApi.Model.Types;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using UnityEngine;

public class StorageManager : Singleton<StorageManager>
{
    public delegate void NextBlocknumberHandler(uint blocknumber);

    public event NextBlocknumberHandler OnNextBlocknumber;

    public delegate void StorageUpdatedHandler(uint blocknumber);

    public event StorageUpdatedHandler OnStorageUpdated;

    public delegate void HexaBoardChangedHandler(HexaBoard hexaBoard);

    public event HexaBoardChangedHandler OnChangedHexaBoard;

    public delegate void HexaPlayerChangedHandler(HexaPlayer hexaPlayer);

    public event HexaPlayerChangedHandler OnChangedHexaPlayer;

    public delegate void HexaSelectionChangedHandler(List<byte> hexaSelection);

    public event HexaSelectionChangedHandler OnChangedHexaSelection;

    public delegate void NextPlayerTurnHandler(byte playerTurn);

    public event NextPlayerTurnHandler OnNextPlayerTurn;

    public delegate void BoardStateChangedHandler(HexBoardState boardState);

    public event BoardStateChangedHandler OnBoardStateChanged;

    public NetworkManager Network => NetworkManager.GetInstance();

    public uint BlockNumber { get; private set; }

    public AccountInfoSharp AccountInfo { get; private set; }

    public HexaGame HexaGame { get; private set; }

    public bool UpdateHexalem { get; internal set; }

    //public int PlayerIndex { get; private set; }

    /// <summary>
    /// Awake is called when the script instance is being loaded
    /// </summary>
    protected override void Awake()
    {
        base.Awake();
        //Your code goes here

        UpdateHexalem = true;
    }

    /// <summary>
    /// Start is called before the first frame update
    /// </summary>
    private void Start()
    {
        InvokeRepeating(nameof(UpdatedBaseData), 1.0f, 2.0f);
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
        }
        else
        {

            var playerBoards = new List<BoardSharp>();
            foreach (var player in playerGame.Players)
            {
                var playerBoard = await Network.Client.GetBoardAsync(player, CancellationToken.None);
                if (playerBoard != null)
                {
                    playerBoards.Add(playerBoard);
                }
            }

            HexaGame oldGame = null;
            if (HexaGame != null)
            {
                oldGame = (HexaGame)HexaGame.Clone();
            }
            HexaGame = HexalemWrapper.GetHexaGame(playerGame, playerBoards.ToArray());
            // check for the event
            HexaGameDiff(oldGame, HexaGame, PlayerIndex(Network.Client.Account).Value);
        }

        OnStorageUpdated?.Invoke(blockNumber.Value);
    }

    public void HexaGameDiff(HexaGame oldGame, HexaGame newGame, int playerIndex)
    {
        if (newGame == null)
        {
            return;
        }

        var newPlayer = newGame.HexaTuples[playerIndex].player;
        if (oldGame == null || !oldGame.HexaTuples[playerIndex].player.Value.SequenceEqual(newPlayer.Value))
        {
            Debug.Log("[EVENT] OnChangedHexaPlayer");
            OnChangedHexaPlayer?.Invoke(newPlayer);
        }

        var newBoard = newGame.HexaTuples[playerIndex].board;
        if (oldGame == null || !oldGame.HexaTuples[playerIndex].board.IsSame(newBoard))
        {
            Debug.Log("[EVENT] OnChangedHexaBoard");
            OnChangedHexaBoard?.Invoke(newBoard);
        }

        if (oldGame == null || !oldGame.UnboundTileOffers.SequenceEqual(newGame.UnboundTileOffers))
        {
            Debug.Log("[EVENT] OnSelectionChanged");
            OnChangedHexaSelection?.Invoke(newGame.UnboundTileOffers);
        }

        if (oldGame == null || oldGame.PlayerTurn != newGame.PlayerTurn || oldGame.HexBoardRound != newGame.HexBoardRound)
        {
            Debug.Log("[EVENT] OnNextPlayerTurn");
            OnNextPlayerTurn?.Invoke(newGame.PlayerTurn);
        }

        if (oldGame == null || oldGame.HexBoardState != newGame.HexBoardState )
        {
            Debug.Log("[EVENT] OnBoardStateChanged");
            OnBoardStateChanged?.Invoke(newGame.HexBoardState);
        }
    }

    public void SetTrainGame(HexaGame newGame, int playerIndex)
    {
        HexaGame oldGame = null;
        if (HexaGame != null)
        {
            oldGame = (HexaGame)HexaGame.Clone();
        }
        // check for the event
        HexaGame = newGame;
        HexaGameDiff(oldGame, newGame, playerIndex);
    }

    public int? PlayerIndex(Account account) => HexaGame?.HexaTuples.FindIndex(p => p.player.Id.SequenceEqual(account.Bytes));

    public HexaPlayer Player(int playerIndex) => HexaGame?.HexaTuples[playerIndex].player;
    public HexaBoard Board(int playerIndex) => HexaGame?.HexaTuples[playerIndex].board;
}