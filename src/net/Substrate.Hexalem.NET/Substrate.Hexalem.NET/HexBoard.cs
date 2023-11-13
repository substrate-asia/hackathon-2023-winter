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

        public byte[] BoardValue { get; set; }

        public byte[] SelectionBase { get; set; }

        public byte[] SelectionCurrent { get; set; }

        public HexBoard(byte[] hash)
        {
            SelectionBase = hash;
            BoardValue = new byte[64];
        }

        public bool Initialize(byte players)
        {
            // game state [6 bytes]
            HexBoardState = HexBoardState.Round;
            HexBoardRound = 0;
            HexBoardTurn = 0;
            Players = players;
            PlayerTurn = 0;
            Selection = 2;

            // player 1 [4 bytes]
            var player1 = 0;
            SetRessources(playerId: player1, mana: 0, human: 1);
            // grid player 1 [25 bytes]
            InitGrid(playerId: player1, home: new HexTile(HexTileType.Home, HexTileLevel.Normal));

            var player2 = 1;
            // player 2 [4 bytes]
            SetRessources(playerId: player2, mana: 0, human: 1);
            // grid player 2 [25 bytes]
            InitGrid(playerId: player2, home: new HexTile(HexTileType.Home, HexTileLevel.Normal));

            return true;
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
        private void InitGrid(int playerId, HexTile home)
        {
            HexGrid(playerId)[12] = home.Value;
        }

        public HexBoardState HexBoardState
        {
            get => (HexBoardState)BoardValue[0];
            set => BoardValue[0] = (byte)value;
        }

        /// <summary>
        /// Holding the current round number
        /// There is a maximum of 64 rounds per game
        /// </summary>
        public byte HexBoardRound
        {
            get => (byte)(BoardValue[1] >> 2);
            set => BoardValue[1] = (byte)((BoardValue[1] & 0b0000_0011) | (value << 2));
        }

        /// <summary>
        /// Holding the current turn number
        /// There is a maximum of 4 turns per round
        /// </summary>
        public byte HexBoardTurn
        {
            get => (byte)(BoardValue[1] & 0b0000_0011);
            set => BoardValue[1] = (byte)((BoardValue[1] & 0b0000_0011) | (value & 0b0000_0011));
        }

        public byte Players
        {
            get => (byte)(BoardValue[2] >> 4);
            set => BoardValue[2] = (byte)((BoardValue[2] & 0x0F) | (value << 4));
        }

        public byte PlayerTurn
        {
            get => (byte)(BoardValue[2] & 0x0F);
            set => BoardValue[2] = (byte)((BoardValue[2] & 0xF0) | (value & 0x0F));
        }

        public byte Selection
        {
            get => (byte)(BoardValue[3] >> 4);
            set => BoardValue[3] = (byte)((BoardValue[3] & 0x0F) | (value << 4));
        }

        /// <summary>
        /// Get the grid of a player
        /// </summary>
        /// <param name="playerId"></param>
        /// <returns></returns>
        public HexGrid HexGrid(int playerId)
        {
            var index = 6 + 4 + (playerId * (4 + 25));
            return new HexGrid(Helper.ExtractSubArray(BoardValue, index, (int)GameConfig.GRID_SIZE));
        }

        private void SetRessources(int playerId, int mana, int human)
        {
            // set the ressources in the 4 player bytes
            // 0x00 0x00 0x00 0x00
        }
    }
}