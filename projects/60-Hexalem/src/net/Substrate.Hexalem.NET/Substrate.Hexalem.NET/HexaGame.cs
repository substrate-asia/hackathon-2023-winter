using Serilog;
using Substrate.Hexalem.Engine.Extensions;
using Substrate.Hexalem.Engine.GameException;
using Substrate.NetApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Substrate.Hexalem.Test")]

namespace Substrate.Hexalem.Engine
{
    public partial class HexaGame : IHexaBase, ICloneable
    {
        public const int STORAGE_SIZE = 32;
        public const int ADDRESS_SIZE = 32;

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
            if (id.Length != STORAGE_SIZE)
                throw new ArgumentException($"id is not {STORAGE_SIZE} bytes length (currently = {id.Length})");

            Id = id;
            Value = new byte[STORAGE_SIZE];

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

            RefillSelection(blockNumber, SelectBase);
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

            if (UnboundTileOffers.Count < (SelectBase / 2 + 1))
            {
                Log.Debug("UnboundTileOffers is below half");
                if (SelectBase < HexalemConfig.GetInstance().MaxTileSelection)
                {
                    Log.Debug($"Selection is now {SelectBase}");
                    SelectBase += 2;
                }

                RefillSelection(blockNumber, SelectBase);
            }
        }

        public string Export()
        {
            var result = new List<byte>();

            result.AddRange(Id);
            result.AddRange(Value);

            // Unbounded tiles are always <= SelectBase, we fill missing tiles (already draw) with -1
            var unsetTile = Enumerable.Range(0, SelectBase).Select(x => (byte)0);
            result.AddRange(UnboundTileOffers.Concat(unsetTile.Skip(UnboundTileOffers.Count)));

            foreach (var (player, board) in HexaTuples)
            {
                result.AddRange(player.Id);
                result.AddRange(player.Value);

                result.AddRange(board.Value);
            }

            return Utils.Bytes2HexString(result.ToArray());
        }

        public static HexaGame Import(string hex)
        {
            int p = 0;
            var data = Utils.HexToByteArray(hex);
            var id = data.Take(STORAGE_SIZE).ToArray();
            p += STORAGE_SIZE;

            var value = data.Skip(p).Take(STORAGE_SIZE).ToArray();
            p += STORAGE_SIZE;

            var playerCount = value[3];
            var selectBase = value[5];

            var unboundTile = data.Skip(p).Take(selectBase).Where(x => x > 0).ToArray();
            p += selectBase;

            var gridSize = (data.Skip(p).ToArray().Length - ((ADDRESS_SIZE + HexaPlayer.STORAGE_SIZE) * playerCount)) / playerCount;

            if(gridSize != (int)GridSize.Small && gridSize != (int)GridSize.Medium && gridSize != (int)GridSize.Large)
            {
                throw new InvalidOperationException("Grid size is not valid");
            }

            var hexaTuple = new List<(HexaPlayer player, HexaBoard board)>();

            for (int i = 0; i < playerCount; i++)
            {
                var pId = data.Skip(p).Take(ADDRESS_SIZE).ToArray();
                p += ADDRESS_SIZE;

                var pValue = data.Skip(p).Take(HexaPlayer.STORAGE_SIZE).ToArray();
                p += HexaPlayer.STORAGE_SIZE;

                var board = data.Skip(p).Take(gridSize).ToArray();
                p += gridSize;

                hexaTuple.Add((new HexaPlayer(pId, pValue), new HexaBoard(board)));
            }
            
            if(p != data.Length)
            {
                throw new InvalidOperationException("Every bytes has not been set");
            }

            return new HexaGame(id, hexaTuple)
            {
                Value = value,
                UnboundTileOffers = unboundTile.ToList()
            };
        }

        /// <summary>
        /// Refill selection
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="selectBase">selection size</param>
        /// <returns></returns>
        internal void RefillSelection(uint blockNumber, int selectBase)
        {
            var offSet = (byte)(blockNumber % 32);

            for (int i = UnboundTileOffers.Count; i < selectBase; i++)
            {
                byte tileIndex = (byte)(Id[(offSet + i) % 32] % GameConfig.TILE_COSTS.Length);

                UnboundTileOffers.Add(tileIndex);
            }
        }

        #region Choose and place
        /// <summary>
        ///
        /// </summary>
        /// <param name="playerIndex"></param>
        /// <param name="selectionIndex"></param>
        /// <param name="gridIndex"></param>
        /// <returns></returns>
        public bool CanChooseAndPlace(byte playerIndex, int selectionIndex, int gridIndex)
        {
            var (_, board) = HexaTuples[PlayerTurn];

            var coords = board.ToCoords(gridIndex);

            return CanChooseAndPlace(playerIndex, selectionIndex, coords);
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
        /// <param name="gridIndex"></param>
        /// <returns></returns>
        internal bool ChooseAndPlace(byte playerIndex, int selectionIndex, int gridIndex)
        {
            if (!CanChooseAndPlace(playerIndex, selectionIndex, gridIndex))
            {
                Log.Error($"{nameof(HexaGame)}.{nameof(CanChooseAndPlace)}.({playerIndex}, {selectionIndex}, {gridIndex}) return false. Debug state = {Export()}");
                return false;
            }

            var (_, board) = HexaTuples[PlayerTurn];

            var coords = board.ToCoords(gridIndex);

            return ChooseAndPlace(playerIndex, selectionIndex, coords);
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
                Log.Error($"{nameof(HexaGame)}.{nameof(CanChooseAndPlace)}.({playerIndex}, {selectionIndex}, {coords}) return false. Debug state = {Export()}");
                return false;
            }

            var (player, board) = HexaTuples[PlayerTurn];

            var tileOffer = GameConfig.TILE_COSTS[UnboundTileOffers[selectionIndex]];

            HexaTile tile = tileOffer.TileToBuy;

            // check if tile can be placed
            board.Place(coords, tile);

            // remove ressources from player
            var tileCost = tileOffer.SelectCost;

            player[tileCost.MaterialType] -= tileCost.Cost;

            UnboundTileOffers.RemoveAt(selectionIndex);
            Log.Debug("UnboundTile num {num} succesfully removed", selectionIndex);

            Played = true;

            // Update board patterns after successfully placing a tile
            _ = board.SetPatterns(coords);

            return true;
        }
        #endregion

        #region Upgrade

        /// <summary>
        /// Can upgrade a tile
        /// </summary>
        /// <param name="playerIndex"></param>
        /// <param name="gridIndex"></param>
        /// <returns></returns>
        public bool CanUpgrade(byte playerIndex, int gridIndex)
        {
            var (_, board) = HexaTuples[playerIndex];

            var coords = board.ToCoords(gridIndex);

            return CanUpgrade(playerIndex, coords);
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

            var (player, board) = HexaTuples[playerIndex];

            var tile = (HexaTile)board[coords.q, coords.r];
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
        /// <param name="gridIndex"></param>
        /// <returns></returns>
        internal bool Upgrade(byte playerIndex, int gridIndex)
        {
            var (_, board) = HexaTuples[PlayerTurn];

            var coords = board.ToCoords(gridIndex);

            return Upgrade(playerIndex, coords);
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
                Log.Error($"{nameof(HexaGame)}.{nameof(Upgrade)}({playerIndex}, {coords}) return false. Debug state = {Export()}");
                return false;
            }

            var (player, board) = HexaTuples[PlayerTurn];

            // Ensure coord have a valid tile
            var existingTile = (HexaTile)board[coords.q, coords.r];

            existingTile.Upgrade();

            HexaTuples[PlayerTurn].board[coords.q, coords.r] = existingTile;
            var ressourceCost = HexalemConfig.GetInstance().MapTileUpgradeCost[existingTile.TileType][existingTile.TileLevel];

            for (int i = 0; i < ressourceCost.Length; i++)
            {
                player[(RessourceType)i] -= ressourceCost[i];
            }

            return true;
        }
        #endregion

        /// <summary>
        /// Can finish turn
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        public bool CanFinishTurn(uint blockNumber, byte playerIndex)
        {
            if (!EnsureCurrentPlayer(playerIndex))
            {
                return false;
            }

            return true;
        }   

        /// <summary>
        /// Finish turn
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        internal bool FinsihTurn(uint blockNumber, byte playerIndex)
        {
            // check if can finish turn
            if (!CanFinishTurn(blockNumber, playerIndex))
            {
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
                RefillSelection(blockNumber, SelectBase);
            }

            return true;
        }

        /// <summary>
        /// Can force finish turn
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        public bool CanForceFinishTurn(uint blockNumber, byte playerIndex)
        {
            if (EnsureCurrentPlayer(playerIndex))
            {
                return false;
            }

            if (!EnsureTimePassed(blockNumber))
            {
                return false;
            }

            return true;
        }   

        /// <summary>
        /// Force finish turn
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <param name="playerIndex"></param>
        /// <returns></returns>
        internal bool ForceFinsihTurn(uint blockNumber, byte playerIndex)
        {
            // check if can force finish turn
            if (!CanForceFinishTurn(blockNumber, playerIndex))
            {
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
                RefillSelection(blockNumber, SelectBase);
            }

            return true;
        }

        /// <summary>
        /// Check if a player has won the game
        /// </summary>
        /// <returns></returns>
        public bool IsFinished()
        {
            var player = HexaTuples[PlayerTurn].player;

            if (player.HasReachedTargetGoal())
            {
                player.TargetState = TargetState.Achieved;
                HexBoardState = HexBoardState.Finish;
                Log.Information("Player {num} has reached his win condition {winCondition} !", PlayerTurn, player.TargetGoal);
                return true;
            }

            if (HexaTuples.Select(p => p.board).All(p => p.IsFull))
            {
                HexaTuples.ForEach(p => p.player.TargetState = TargetState.Failed);
                HexBoardState = HexBoardState.Finish;
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
            hexaPlayer[RessourceType.Humans] = newHumans; // Humans are not cumulative
            hexaPlayer[RessourceType.Water] = newWater; // Water is not cumulative
            hexaPlayer[RessourceType.Food] = newFood; // Food is not cumulative
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
        /// Ensure that the player has enough ressources to upgrade the tile
        /// </summary>
        /// <param name="player"></param>
        /// <param name="tile"></param>
        /// <returns></returns>
        private bool EnsureRessourcesToUpgrade(HexaPlayer player, HexaTile tile)
        {
            if (!HexalemConfig.GetInstance().MapTileUpgradeCost.TryGetValue(tile.TileType, out List<byte[]> costs) || costs.Count <= tile.TileLevel)
            {
                return false;
            }

            var ressourceCost = costs[tile.TileLevel];

            if (ressourceCost == null)
            {
                Log.Error(LogMessages.InvalidTileToUpgrade(tile));
                return false;
            }

            for (int i = 0; i < ressourceCost.Length; i++)
            {
                if (player[(RessourceType)i] < ressourceCost[i])
                {
                    Log.Error(LogMessages.MissingRessourcesToUpgrade(player, tile, (RessourceType)i, ressourceCost[i]));
                    return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Ensure that the allowed time to play passed
        /// </summary>
        /// <param name="blockNumber"></param>
        /// <returns></returns>
        public bool EnsureTimePassed(uint blockNumber)
        {
            var lastMove = BitConverter.ToUInt32(LastMove);
            if (blockNumber < lastMove + HexalemConfig.GetInstance().BlocksToPlayLimit)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Ensure that the player has enough ressources to play the tile
        /// </summary>
        /// <param name="player"></param>
        /// <param name="tile"></param>
        /// <returns></returns>
        private bool EnsureRessourcesToPlay(HexaPlayer player, TileOffer tileOffer)
        {
            var tileCost = tileOffer.SelectCost;

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

        public object Clone()
        {
            var cloneGame = new HexaGame((byte[])Id.Clone(), HexaTuples.Select(x => ((HexaPlayer)x.player.Clone(), (HexaBoard)x.board.Clone())).ToList())
            {
                Value = (byte[])Value.Clone(),
                UnboundTileOffers = UnboundTileOffers.Select(x => x).ToList()
            };

            return cloneGame;
        }

        public bool IsSame(HexaGame other)
        {
            if (other == null)
                return true;

            // Selection does not count
            var isEqual = Id.SequenceEqual(other.Id);
            isEqual = isEqual && Value.SequenceEqual(other.Value);
            isEqual = isEqual && UnboundTileOffers.SequenceEqual(other.UnboundTileOffers);
            isEqual = isEqual && HexaTuples.Count == other.HexaTuples.Count;

            for (int i = 0; i < HexaTuples.Count; i++)
            {
                isEqual = isEqual && HexaTuples[i].player.Value.SequenceEqual(other.HexaTuples[i].player.Value);
                isEqual = isEqual && HexaTuples[i].board.Value.SequenceEqual(other.HexaTuples[i].board.Value);
            }

            return isEqual;
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

            Dictionary<TileType, Dictionary<TilePattern, List<byte[]>>> production = HexalemConfig.GetInstance().MapTileProduction;

            switch (resourceType)
            {
                case RessourceType.Mana:
                    result += (byte)(boardStats[TileType.Home] * 1); // 1 Mana from Home
                    result += (byte)(player[RessourceType.Humans] / 2); // 1 Mana from 3 Humans

                    // Additional pattern logic
                    break;

                case RessourceType.Humans:

                    // Physiological needs: breathing, food, water, shelter, clothing, sleep
                    result = (byte)Math.Min(player[RessourceType.Food] * HexalemConfig.GetInstance().FoodPerHuman, player[RessourceType.Water] * HexalemConfig.GetInstance().WaterPerHuman);

                    var homeWeighted = 0;
                    for (byte level = 0; level < 4; level++)
                    {
                        homeWeighted += (level + 1) * boardStats[TileType.Home, level];
                    }
                    result = (byte)Math.Max(Math.Min(result, homeWeighted * HexalemConfig.GetInstance().HomePerHumans), 1);

                    // Additional pattern logic
                    break;

                case RessourceType.Water:
                    result += (byte)(boardStats[TileType.Water] * production[TileType.Water][TilePattern.Normal][0][(int)resourceType]);

                    // Additional pattern logic
                    break;

                case RessourceType.Food:

                    result += (byte)(boardStats[TileType.Grass] * production[TileType.Grass][TilePattern.Normal][0][(int)resourceType]);
                    result += (byte)(boardStats[TileType.Tree] * production[TileType.Tree][TilePattern.Normal][0][(int)resourceType]);
                    break;

                case RessourceType.Wood:
                    result += (byte)Math.Min(
                        boardStats[TileType.Tree] * production[TileType.Tree][TilePattern.Normal][0][(int)resourceType], 
                        player[RessourceType.Humans] / production[TileType.Tree][TilePattern.Normal][4][(int)resourceType]);
                    break;

                case RessourceType.Stone:
                    result += (byte)Math.Min(
                        boardStats[TileType.Mountain] * production[TileType.Mountain][TilePattern.Normal][0][(int)resourceType],
                        player[RessourceType.Humans] / production[TileType.Mountain][TilePattern.Normal][4][(int)resourceType]);

                    result += (byte)Math.Min(
                        boardStats[TileType.Cave] * production[TileType.Cave][TilePattern.Normal][0][(int)resourceType],
                        player[RessourceType.Humans] / production[TileType.Cave][TilePattern.Normal][4][(int)resourceType]);
                    break;

                case RessourceType.Gold:
                    result += (byte)Math.Min(
                        boardStats[TileType.Cave] * production[TileType.Cave][TilePattern.Normal][0][(int)resourceType],
                        player[RessourceType.Humans] / production[TileType.Cave][TilePattern.Normal][4][(int)resourceType]);
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

        public bool Played
        {
            get => Value[10] == 1;
            set => Value[10] = (byte)(value ? 1 : 0);
        }
    }
}