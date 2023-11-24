using Serilog;
using Substrate.Hexalem.NET;
using Substrate.Hexalem.NET.Extensions;
using Substrate.Hexalem.NET.GameException;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Substrate.Hexalem
{
    public partial class HexaGame : IHexaBase
    {
        public byte[] Id { get; set; }

        public byte[] Value { get; set; }

        /// <summary>
        /// Associate a player and his board
        /// </summary>
        public List<(HexaPlayer player, HexaBoard board)> HexaTuples { get; set; }

        /// <summary>
        /// Tiles that can be bought by players
        /// </summary>
        public List<HexaTile> UnboundTiles { get; private set; }

        public HexaGame(byte[] id, byte[] selectionHash, List<(HexaPlayer, HexaBoard)> hexaTuples)
        {
            Id = id;
            Value = new byte[16];

            HexaTuples = hexaTuples;
            UnboundTiles = new List<HexaTile>();

            HexBoardState = HexBoardState.Preparing;
            PlayersCount = (byte)hexaTuples.Count;
        }

        public void Init(uint blockNumber)
        {
            HexaTuples.ForEach(p =>
            {
                p.player.Init(blockNumber);
                p.board.Init(blockNumber);
            });

            HexBoardState = HexBoardState.Running;
            HexBoardRound = 0;
            HexBoardTurn = 0;
            PlayerTurn = 0;
            SelectBase = 2;

            UnboundTiles = RenewSelection(blockNumber, SelectBase);
        }

        public void NextRound(uint blockNumber)
        {
            HexaTuples.ForEach(p => { p.player.NextRound(blockNumber); p.board.NextRound(blockNumber); });

            HexBoardTurn = 0;
            HexBoardRound += 1;
            Log.Information("Next round : reset turn to 0 and increase board round (now = {hbt})", HexBoardRound);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="blockNumber"></param>
        public void PostMove(uint blockNumber)
        {
            HexaTuples.ForEach(p => { p.player.PostMove(blockNumber); p.board.PostMove(blockNumber); });

            if (UnboundTiles.Count < (SelectBase + 1) / 2)
            {
                Log.Debug("UnboundTiles is below half");
                if (SelectBase < GameConfig.NB_MAX_UNBOUNDED_TILES / 2)
                {
                    Log.Information($"Selection is now {SelectBase}");
                    SelectBase += 2;
                }

                UnboundTiles = RenewSelection(blockNumber, SelectBase);
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="selectBase"></param>
        /// <returns></returns>
        internal List<HexaTile> RenewSelection(uint blockNumber, int selectBase)
        {
            var values = Enum.GetValues(typeof(TileType))
                .Cast<TileType>()
                .Where(v => (int)v > 1).ToArray();

            var offSet = (byte)(blockNumber % 32);
            var result = new List<HexaTile>();
            for (int i = 0; i < selectBase; i++)
            {
                var rawTile = Id[(offSet + selectBase) % 32];
                result.Add((byte)(((byte)TileRarity.Normal << 4) | (byte)(int)values.GetValue((byte)(rawTile & 0x0F) % values.Length)));
            }
            return result;
        }

        /// <summary>
        /// Choose and place a tile on the board
        /// </summary>
        /// <param name="playerIndex"></param>
        /// <param name="selectionIndex"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        internal bool ChooseAndPlace(byte playerIndex, int selectionIndex, (int, int) coords)
        {
            // check if correct player
            if (PlayerTurn != playerIndex)
            {
                Log.Error(LogMessages.InvalidPlayerTurn(playerIndex, PlayerTurn));

                return false;
            }

            // check if selection is valid
            if (selectionIndex < 0 || selectionIndex >= UnboundTiles.Count)
            {
                Log.Error(LogMessages.InvalidTileSelection(selectionIndex));

                return false;
            }

            var hexaPlayer = HexaTuples[playerIndex].player;
            var hexaBoard = HexaTuples[playerIndex].board;
            var chooseTile = UnboundTiles[selectionIndex];

            // check if player has enough mana
            if (hexaPlayer[RessourceType.Mana] == 0)
            {
                Log.Error("Player ${playerNum} does not have enought mana to play (current mana = {manaValue}", PlayerTurn, hexaPlayer[RessourceType.Mana]);

                return false;
            }

            // check if tile can be placed
            try
            {
                if (!hexaBoard.Place(coords, chooseTile))
                {
                    return false;
                }
            } catch(InvalidMapCoordinate ex)
            {
                Log.Error(ex.Message);
                return false;
            }

            // on a successful place do the storage changes
            hexaPlayer[RessourceType.Mana] -= 1; // Todo : change by mana cost instead of 1

            UnboundTiles.RemoveAt(selectionIndex);
            Log.Debug("UnboundTile num {num} succesfully removed", selectionIndex);

            return true;
        }

        internal bool UpdateTurnState(uint blockNumber, byte playerIndex)
        {
            // check if correct player
            if (PlayerTurn != playerIndex)
            {
                Log.Error(LogMessages.InvalidPlayerTurn(playerIndex, PlayerTurn));
                return false;
            }

            var nbBlockSpentSinceLastMove = blockNumber - BitConverter.ToUInt16(LastMove);
            if (nbBlockSpentSinceLastMove > GameConfig.MAX_TURN_BLOCKS)
            {
                Log.Error(LogMessages.TooMuchTimeToPlay(nbBlockSpentSinceLastMove));
                return false;
            }

            // do storage changes
            LastMove = BitConverter.GetBytes(blockNumber);
            Log.Debug("Saved LastMove {lm}", LastMove.ToLog());

            PlayerTurn = (byte)((PlayerTurn + 1) % PlayersCount);
            Log.Debug("Switch to player {p}", PlayerTurn);

            //HexBoardTurn = (byte)(PlayerTurn == 0 ? 1 : 0);
            HexBoardTurn = (byte)(PlayerTurn % PlayersCount);
            Log.Debug("Switch to board turn {bt}", HexBoardTurn);

            return true;
        }

        internal void UpdateRound(uint blockNumber)
        {
            Log.Information($"BlockNumber = {blockNumber} - End of round {HexBoardRound}, add {GameConfig.FREE_MANA_PER_ROUND} mana to each player and start a new round");

            // add 1 mana to all players
            HexaTuples.ForEach(p =>
            {
                p.Item1[RessourceType.Mana] += GameConfig.FREE_MANA_PER_ROUND;
            });

            HexBoardTurn = 0;
            HexBoardRound += 1;
        }

        internal void CalcRewards(uint blockNumber, byte playerIndex)
        {
            var hexaPlayer = HexaTuples[playerIndex].player;
            var hexaBoard = HexaTuples[playerIndex].board;
            var hexaBoardStats = hexaBoard.Stats();

            var newMana = Evaluate(RessourceType.Mana, hexaPlayer, hexaBoardStats);
            var newHumans = Evaluate(RessourceType.Humans, hexaPlayer, hexaBoardStats);
            var newWater = Evaluate(RessourceType.Water, hexaPlayer, hexaBoardStats);
            var newFood = Evaluate(RessourceType.Food, hexaPlayer, hexaBoardStats);
            var newWood = Evaluate(RessourceType.Wood, hexaPlayer, hexaBoardStats);
            var newStone = Evaluate(RessourceType.Stone, hexaPlayer, hexaBoardStats);
            var newGold = Evaluate(RessourceType.Gold, hexaPlayer, hexaBoardStats);

            // TODO: remove humans being used for multiple resources, by removing them once used for a resource

            hexaPlayer[RessourceType.Mana] += newMana;
            hexaPlayer[RessourceType.Humans] += newHumans;
            hexaPlayer[RessourceType.Water] += newWater;
            hexaPlayer[RessourceType.Food] += newFood;
            hexaPlayer[RessourceType.Wood] += newWood;
            hexaPlayer[RessourceType.Stone] += newStone;
            hexaPlayer[RessourceType.Gold] += newGold;
        }

        internal byte Evaluate(RessourceType resourceType, HexaPlayer player, HexaBoardStats boardStats)
        {
            // https://www.simplypsychology.org/maslow.html
            byte result = 0;

            switch (resourceType)
            {
                case RessourceType.Mana:
                    result += (byte)(boardStats[TileType.Home] * 1); // 1 Mana from Home
                    result += (byte)(player[RessourceType.Humans] / 3); // 1 Mana from 3 Humans

                    // Additional pattern logic
                    break;

                case RessourceType.Humans:
                    result = (byte)(boardStats[TileType.Home] * 1); // 1 Humans start in the Home

                    // Physiological needs: breathing, food, water, shelter, clothing, sleep
                    result = (byte)Math.Min(result, player[RessourceType.Water] * GameConfig.WATER_PER_HUMANS);
                    result = (byte)Math.Min(result, player[RessourceType.Food] * GameConfig.FOOD_PER_HUMANS);

                    var homeWeighted = 0;
                    foreach (TileRarity rarity in Enum.GetValues(typeof(TileRarity)))
                    {
                        homeWeighted += (int)rarity * boardStats[TileType.Home, rarity];
                    }
                    result = (byte)Math.Min(result, homeWeighted * GameConfig.HOME_PER_HUMANS);

                    // Additional pattern logic
                    break;

                case RessourceType.Water:
                    result += (byte)(boardStats[TileType.Water] * GameConfig.WATER_PER_WATER);

                    // Additional pattern logic
                    break;

                case RessourceType.Food:
                    result += (byte)(boardStats[TileType.Grass] * GameConfig.FOOD_PER_GRASS);
                    result += (byte)(boardStats[TileType.Forest] * GameConfig.FOOD_PER_FOREST);

                    // Additional pattern logic
                    break;

                case RessourceType.Wood:
                    // 1 Forest can create Wood for 6 humans, but need 2 humans for 1
                    result += (byte)Math.Min(boardStats[TileType.Forest] * 3, player[RessourceType.Humans] / 2);

                    // Additional pattern logic
                    break;

                case RessourceType.Stone:
                    // 1 Mountain can create Stone for 16 humans, but need 4 humans for 1
                    result += (byte)Math.Min(boardStats[TileType.Mountain] * 4, player[RessourceType.Humans] / 4);
                    // 1 Cave can create wood for 4 humans, but need 2 humans for 1
                    result += (byte)Math.Min(boardStats[TileType.Cave] * 2, player[RessourceType.Humans] / 2);

                    // Additional pattern logic
                    break;

                case RessourceType.Gold:

                    // 1 Rare (delta) Cave can create Gold for 1 humans, but need 3 humans for 1
                    result += (byte)Math.Min(boardStats[TileType.Cave] * 1, player[RessourceType.Humans] / 3);
                    // Additional pattern logic
                    break;
            }

            return result;
        }
    }

    /// <summary>
    /// HexaGame storage class
    /// </summary>
    public partial class HexaGame
    {
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
            get => Value[1];
            set => Value[1] = value;
        }

        /// <summary>
        /// Holding the current turn number
        /// There is a maximum of 4 turns per round
        /// </summary>
        public byte HexBoardTurn
        {
            get => Value[2];
            set => Value[2] = value;
        }

        /// <summary>
        /// Number of players in the game
        /// </summary>
        public byte PlayersCount
        {
            get => Value[3];
            set => Value[3] = value;
        }

        /// <summary>
        /// Player index which is currently play
        /// </summary>
        public byte PlayerTurn
        {
            get => Value[4];
            set => Value[4] = value;
        }

        /// <summary>
        /// Nb tiles a player can buy during his turn
        /// </summary>
        public byte SelectBase
        {
            get => Value[5];
            set => Value[5] = value;
        }

        /// <summary>
        /// Last block number when a player made a move
        /// </summary>
        public byte[] LastMove
        {
            get => Value.Skip(6).Take(4).ToArray();
            set => value.CopyTo(Value, 6);
        }
    }
}