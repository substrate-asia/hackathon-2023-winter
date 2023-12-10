using Serilog;
using Substrate.Hexalem.Extensions;
using Substrate.Hexalem.GameException;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Substrate.Hexalem.Test")]

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
        public List<byte> UnboundTileOffers { get; set; }

        /// <summary>
        /// Shortcut to current player board instance
        /// </summary>
        /// <returns></returns>
        public HexaBoard CurrentPlayerBoard => HexaTuples[PlayerTurn].board;

        /// <summary>
        /// Shortcut to current player instance
        /// </summary>
        /// <returns></returns>
        public HexaPlayer CurrentPlayer => HexaTuples[PlayerTurn].player;

        public HexaGame(byte[] id, List<(HexaPlayer, HexaBoard)> hexaTuples)
        {
            Id = id;
            Value = new byte[GameConfig.GAME_STORAGE_SIZE];

            HexaTuples = hexaTuples;
            UnboundTileOffers = new List<byte>();

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
            PlayerTurn = 0;
            SelectBase = 2;

            UnboundTileOffers = NewSelection(blockNumber, SelectBase);
        }

        public void NextRound(uint blockNumber)
        {
            HexaTuples.ForEach(p => { p.player.NextRound(blockNumber); p.board.NextRound(blockNumber); });

            PlayerTurn = 0;
            HexBoardRound += 1;
            Log.Information("Next round : reset turn to 0 and increase board round (now = {hbt})", HexBoardRound);
        }

        public void PostMove(uint blockNumber)
        {
            HexaTuples.ForEach(p => { p.player.PostMove(blockNumber); p.board.PostMove(blockNumber); });

            if (UnboundTileOffers.Count < (SelectBase + 1) / 2)
            {
                Log.Debug("UnboundTileOffers is below half");
                if (SelectBase < GameConfig.NB_MAX_UNBOUNDED_TILES / 2)
                {
                    Log.Debug($"Selection is now {SelectBase}");
                    SelectBase += 2;
                }

                UnboundTileOffers = RefillSelection(blockNumber, SelectBase);
            }
        }

        /// <summary>
        /// New selection
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="selectBase">selection size</param>
        /// <returns></returns>
        internal List<byte> NewSelection(uint blockNumber, int selectBase)
        {
            var offSet = (byte)(blockNumber % 32);

            var result = new List<byte>();

            for (int i = 0; i < selectBase; i++)
            {
                byte tileIndex = (byte)(Id[(offSet + i) % 32] % 16);

                result.Add(tileIndex);
            }
            return result;
        }

        /// <summary>
        /// Refill selection
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="selectBase">selection size</param>
        /// <returns></returns>
        internal List<byte> RefillSelection(uint blockNumber, int selectBase)
        {
            var offSet = (byte)(blockNumber % 32);
            var result = new List<byte>();
            for (int i = UnboundTileOffers.Count(); i < selectBase; i++)
            {
                byte tileIndex = (byte)(Id[(offSet + i) % 32] % 16);

                result.Add(tileIndex);
            }

            return result;
        }

        /// <param name="playerIndex"></param>
        /// <param name="selectionIndex"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        public bool CanChooseAndPlace(byte playerIndex, int selectionIndex, (int, int) coords)
        {
            if (!EnsureCurrentPlayer(playerIndex))
            {
                return false;
            }

            if (!EnsureValidSelection(selectionIndex))
            {
                return false;
            }

            var (player, board) = HexaTuples[PlayerTurn];

            var tileOffer = GameConfig.TILE_COSTS[UnboundTileOffers[selectionIndex]];

            if (!EnsureRessourcesToPlay(player, tileOffer))
            {
                return false;
            }

            if (!EnsureValidCoords(board, coords))
            {
                return false;
            }

            return board.CanPlace(coords);
        }

        /// <summary>
        /// Choose and place a tile on the board
        /// </summary>
        /// <param name="playerIndex"></param>
        /// <param name="selectionIndex"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        public bool ChooseAndPlace(byte playerIndex, int selectionIndex, (int, int) coords)
        {
            if (!CanChooseAndPlace(playerIndex, selectionIndex, coords))
            {
                return false;
            }

            var (player, board) = HexaTuples[PlayerTurn];

            var tileOffer = GameConfig.TILE_COSTS[UnboundTileOffers[selectionIndex]];

            HexaTile tile = tileOffer.TileToBuy;

            // check if tile can be placed
            board.Place(coords, tile);

            // remove ressources from player
            var tileCost = tileOffer.TileCost;

            player[tileCost.MaterialType] -= tileCost.Cost;

            UnboundTileOffers.RemoveAt(selectionIndex);
            Log.Debug("UnboundTile num {num} succesfully removed", selectionIndex);

            Played = true;

            // Update board patterns after successfully placing a tile
            _ = board.SetPatterns(coords);

            return true;
        }

        /// <summary>
        /// Can upgrade a tile
        /// </summary>
        /// <param name="playerIndex"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        public bool CanUpgrade(byte playerIndex, (int q, int r) coords)
        {
            if (!EnsureCurrentPlayer(playerIndex))
            {
                return false;
            }

            var (player, board) = HexaTuples[PlayerTurn];

            var tile = (HexaTile)board[coords.q, coords.r];
            if (!tile.CanUpgrade())
            {
                return false;
            }

            if (!EnsureRessourcesToUpgrade(player, tile))
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Upgrade a tile
        /// </summary>
        /// <param name="playerIndex"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        public bool Upgrade(byte playerIndex, (int q, int r) coords)
        {
            if (!CanUpgrade(playerIndex, coords))
            {
                return false;
            }

            var (player, board) = HexaTuples[PlayerTurn];

            // Ensure coord have a valid tile
            var existingTile = (HexaTile)board[coords.q, coords.r];

            // Upgrade tile to next level, if failed return
            existingTile.Upgrade();

            HexaTuples[PlayerTurn].board[coords.q, coords.r] = existingTile;
            player[RessourceType.Gold] -= (byte)GameConfig.GoldCostForUpgrade(existingTile.TileLevel);
            player[RessourceType.Humans] -= (byte)GameConfig.MininumHumanToUpgrade(existingTile.TileLevel);

            return true;
        }

        /// <summary>
        /// Update game turn information
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        public bool UpdateTurnState(uint blockNumber, byte playerIndex)
        {
            // check if correct player
            if (!EnsureCurrentPlayer(playerIndex))
            {
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

            // If the player has not played, generate a new selection
            if (Played)
            {
                Played = false;
            }
            else
            {
                UnboundTileOffers = NewSelection(blockNumber, SelectBase);
            }

            return true;
        }

        /// <summary>
        /// Check if a player has won the game
        /// </summary>
        /// <returns></returns>
        public bool IsGameWon()
        {
            var player = HexaTuples[PlayerTurn].player;

            if (player.HasWin())
            {
                Log.Information("Player {num} has reached his win condition {winCondition} !", PlayerTurn, player.WinningCondition.WinningCondition);

                return true;
            }

            return false;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="selectBase"></param>
        /// <returns></returns>
        public List<HexaTile> RenewSelection(uint blockNumber, int selectBase)
        {
            var values = Enum.GetValues(typeof(TileType))
                .Cast<TileType>()
                .Where(v => (int)v > 1).ToArray();

            var offSet = (byte)(blockNumber % 32);
            var result = new List<HexaTile>();
            for (int i = 0; i < selectBase; i++)
            {
                var rawTile = Id[(offSet + selectBase + i) % 32];

                result.Add(new HexaTile(values[rawTile % values.Length], 0 /* Level 0 */, TilePattern.Normal));
            }
            return result;
        }

        /// <summary>
        /// Calculate rewards for a player
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="playerIndex"></param>
        public void CalcRewards(uint blockNumber, byte playerIndex)
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

        /// <summary>
        /// Check if playerIndex is the right <see cref="PlayerTurn"/>
        /// </summary>
        /// <param name="playerIndex"></param>
        /// <returns>True if it is a valid playerIndex</returns>
        private bool EnsureCurrentPlayer(byte playerIndex)
        {
            if (PlayerTurn != playerIndex)
            {
                Log.Error(LogMessages.InvalidPlayerTurn(playerIndex, PlayerTurn));
                return false;
            }

            return true;
        }

        /// <summary>
        /// Ensure that the tile can be upgraded
        /// </summary>
        /// <param name="tile"></param>
        /// <returns></returns>
        private bool EnsureUpgradableTile(HexaTile tile)
        {
            var upgradableTileTypes = GameConfig.UpgradableTypeTile();

            if (tile.TileType == TileType.Empty
             || tile.TileLevel == 3 /* Highest level */
             || !upgradableTileTypes.Contains(tile.TileType))
            {
                Log.Error(LogMessages.InvalidTileToUpgrade(tile));
                return false;
            }

            return true;
        }

        /// <summary>
        /// Ensure that the player have enough ressources to upgrade the tile
        /// </summary>
        /// <param name="player"></param>
        /// <param name="tile"></param>
        /// <returns></returns>
        private bool EnsureRessourcesToUpgrade(HexaPlayer player, HexaTile tile)
        {
            // Check if player have enought ressources to upgrade
            var goldRequired = GameConfig.GoldCostForUpgrade(tile.TileLevel);
            var humansRequired = GameConfig.MininumHumanToUpgrade(tile.TileLevel);
            if (player[RessourceType.Gold] < goldRequired
             || player[RessourceType.Humans] < humansRequired)
            {
                Log.Error(LogMessages.MissingRessourcesToUpgrade(player, tile, goldRequired, humansRequired));
                return false;
            }

            return true;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="player"></param>
        /// <param name="tile"></param>
        /// <returns></returns>
        private bool EnsureRessourcesToPlay(HexaPlayer player, TileOffer tileOffer)
        {
            var tileCost = tileOffer.TileCost;

            if (player[tileCost.MaterialType] < tileCost.Cost)
            {
                Log.Error(LogMessages.MissingRessourcesToPlay(player, tileOffer.TileToBuy, tileCost.MaterialType, tileCost.Cost));
                return false;
            }

            return true;
        }

        /// <summary>
        /// Ensure that the selection index is valid
        /// </summary>
        /// <param name="selectionIndex"></param>
        /// <returns></returns>
        private bool EnsureValidSelection(int selectionIndex)
        {
            if (selectionIndex < 0 || selectionIndex >= UnboundTileOffers.Count)
            {
                Log.Error(LogMessages.InvalidTileSelection(selectionIndex));
                return false;
            }

            return true;
        }

        /// <summary>
        /// Ensure that the coords are valid
        /// </summary>
        /// <param name="board"></param>
        /// <param name="coords"></param>
        /// <returns></returns>
        private bool EnsureValidCoords(HexaBoard board, (int q, int r) coords)
        {
            if (!board.IsValidHex(coords.q, coords.r))
            {
                Log.Error(LogMessages.InvalidCoords(coords.q, coords.r));
                return false;
            }

            return true;
        }

        public HexaGame Clone()
        {
            var gameId = (byte[])this.Id.Clone();
            var players = this.HexaTuples.Select(x => (x.player.Clone(), x.board.Clone())).ToList();

            var cloneGame = new HexaGame(gameId, players);

            cloneGame.HexBoardState = this.HexBoardState;
            cloneGame.HexBoardRound = this.HexBoardRound;
            cloneGame.PlayerTurn = this.PlayerTurn;
            cloneGame.SelectBase = this.SelectBase;

            cloneGame.UnboundTileOffers = this.UnboundTileOffers.Select(x => x).ToList();

            return cloneGame;
        }

        public override string ToString()
        {
            string log = $"HexaGame value :";

            log += $"\n\t Id = {string.Join(',', Id)}";
            log += $"\n\t HexBoardState = {HexBoardState}";
            log += $"\n\t HexBoardRound = {HexBoardRound}";
            log += $"\n\t PlayerTurn = {PlayerTurn}";
            log += $"\n\t UnboundTileOffers.Length = {UnboundTileOffers.Count}";

            log += $"\n\t Nb players = {PlayersCount}";
            for (int i = 0; i < PlayersCount; i++)
            {
                log += $"\n\t\t Player {i} = {string.Join(',', HexaTuples[i].player.Id)}";
            }

            return log;
        }

        /// <summary>
        /// Evaluate a ressource type for a player
        /// </summary>
        /// <param name="resourceType"></param>
        /// <param name="player"></param>
        /// <param name="boardStats"></param>
        /// <returns></returns>
        public static byte Evaluate(RessourceType resourceType, HexaPlayer player, HexaBoardStats boardStats)
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
                    // Physiological needs: breathing, food, water, shelter, clothing, sleep
                    result = (byte)Math.Min(player[RessourceType.Food] * GameConfig.FOOD_PER_HUMANS, player[RessourceType.Water] * GameConfig.WATER_PER_HUMANS);

                    var homeWeighted = 0;
                    for (byte level = 0; level < 4; level++)
                    {
                        homeWeighted += (int)(level + 1) * boardStats[TileType.Home, level];
                    }
                    result = (byte)Math.Max(Math.Min(result, homeWeighted * GameConfig.HOME_PER_HUMANS), 1);

                    // Additional pattern logic
                    break;

                case RessourceType.Water:
                    result += (byte)(boardStats[TileType.Water] * GameConfig.WATER_PER_WATER);

                    // Additional pattern logic
                    break;

                case RessourceType.Food:
                    result += (byte)(boardStats[TileType.Grass] * GameConfig.FOOD_PER_GRASS);
                    result += (byte)(boardStats[TileType.Tree] * GameConfig.FOOD_PER_TREE);

                    // Additional pattern logic
                    break;

                case RessourceType.Wood:
                    // 1 Tree can create Wood for 6 humans, but need 2 humans for 1
                    result += (byte)Math.Min(boardStats[TileType.Tree] * 3, player[RessourceType.Humans] / 2);

                    // Additional pattern logic
                    break;

                case RessourceType.Stone:
                    // 1 Mountain can create stone for 16 humans, but need 4 humans for 1
                    result += (byte)Math.Min(boardStats[TileType.Mountain] * 4, player[RessourceType.Humans] / 4);
                    // 1 Cave can create stone for 4 humans, but need 2 humans for 1
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

        public bool Played { get; set; } = false;
    }
}