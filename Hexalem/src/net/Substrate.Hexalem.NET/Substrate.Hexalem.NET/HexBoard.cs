using Serilog;
using Substrate.Hexalem.NET;
using System;

namespace Substrate.Hexalem
{
    public enum HexBoardState
    {
        Round,
        Reward,
        Finish
    }

    public class HexBoard
    {
        public uint LastMove { get; set; }
        public byte[] Value { get; set; }

        public byte[] SelectionBase { get; set; }
        public byte[] SelectionCurrent { get; set; }

        public HexPlayer[] Players { get; set; }
        public HexGrid[] PlayerGrids { get; set; }

        public HexBoard(byte[] hash)
        {
            SelectionBase = hash;
            Value = new byte[64];
        }

        public HexBoard(HexPlayer[] players, HexGrid[] playerGrids)
        {
            Players = players;
            PlayerGrids = playerGrids;

            Value = new byte[GameConfig.GameStateStorageSize + Players.Length * (GameConfig.PlayerAccountStorageSize + playerGrids.Length)];
        }

        public bool Initialize(byte players, HexGridSize gridSize)
        {
            // game state [6 bytes]
            HexBoardState = HexBoardState.Round;
            HexBoardRound = 0;
            HexBoardTurn = 0;
            PlayersCount = players;
            PlayerTurn = 0;
            Selection = 2;
            HexGridSize = gridSize;

            Players = new HexPlayer[PlayersCount];
            PlayerGrids = new HexGrid[PlayersCount];

            for (int i = 0; i < PlayersCount; i++)
            {
                // [6 bytes]
                Players[i] = BuildPlayer(i);

                // [25 bytes]
                PlayerGrids[i] = BuildGrid(i);
            }

            return true;
        }

        public HexPlayer BuildPlayer(int playerId)
        {
            var index = GameConfig.GameStateStorageSize + (playerId * GameConfig.PlayerRessourcesStorageSize);

            return new HexPlayer(Helper.ExtractSubArray(Value, index, GameConfig.PlayerRessourcesStorageSize));
        }

        /// <summary>
        /// Get the grid of a player
        /// </summary>
        /// <param name="playerId"></param>
        /// <returns></returns>
        public HexGrid BuildGrid(int playerId)
        {
            var index = GameConfig.GameStateStorageSize +
                GameConfig.PlayerRessourcesStorageSize +
                (playerId * (GameConfig.PlayerRessourcesStorageSize + GameConfig.PlayerGridStorageSize(HexGridSize)));

            var playerGrid = new HexGrid(Helper.ExtractSubArray(Value, index, (int)HexGridSize));
            playerGrid[(int)HexGridSize / 2] = new HexTile(HexTileType.Home, HexTileLevel.Normal);
            return playerGrid;
        }

        public void ShuffleSelection(uint blockNumber)
        {
            var values = Enum.GetValues(typeof(Helper.ShuffleType));

            SelectionBase = Helper.ShuffleArray(SelectionBase, (Helper.ShuffleType)values.GetValue(blockNumber % values.Length));
            SelectionCurrent = Helper.ExtractSubArray(SelectionBase, 0, Selection * 2);
            // set next selection set
            if (Selection < 16)
            {
                Selection = (byte)(Selection + 2);
            }
        }

        /// <summary>
        /// Initialize the grid of a player
        /// </summary>
        /// <param name="playerId"></param>
        /// <param name="home"></param>
        //private void InitGrid(int playerId, HexTile home)
        //{
        //    HexGrid(playerId)[12] = home.Value;
        //}

        public HexBoardState HexBoardState
        {
            get => (HexBoardState)Value[0];
            set => Value[0] = (byte)value;
        }

        /// <summary>
        /// Holding the current round number
        /// There is a maximum of 64 rounds per game
        /// </summary>
        public byte HexBoardRound
        {
            get => (byte)(Value[1] >> 2);
            set => Value[1] = (byte)((Value[1] & 0b0000_0011) | (value << 2));
        }

        /// <summary>
        /// Holding the current turn number
        /// There is a maximum of 4 turns per round
        /// </summary>
        public byte HexBoardTurn
        {
            get => (byte)(Value[1] & 0b0000_0011);
            set => Value[1] = (byte)((Value[1] & 0b0000_0011) | (value & 0b0000_0011));
        }

        public byte PlayersCount
        {
            get => (byte)(Value[2] >> 4);
            set => Value[2] = (byte)((Value[2] & 0x0F) | (value << 4));
        }

        public byte PlayerTurn
        {
            get => (byte)(Value[2] & 0x0F);
            set => Value[2] = (byte)((Value[2] & 0xF0) | (value & 0x0F));
        }

        public byte Selection
        {
            get => (byte)(Value[3] >> 4);
            set => Value[3] = (byte)((Value[3] & 0x0F) | (value << 4));
        }

        public HexGridSize HexGridSize
        {
            get => (HexGridSize)Value[4];
            set => Value[4] = (byte)value;
        }
    }
}