using Newtonsoft.Json.Linq;
using Serilog;
using Substrate.Hexalem.Integration.Model;
using Substrate.Hexalem.NET;
using Substrate.Hexalem.NET.Extensions;
using Substrate.Hexalem.NET.GameException;
using Substrate.Integration.Helper;
using Substrate.NetApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
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
        public List<HexaTile> UnboundTiles { get; private set; }

        protected HexaGame()
        {
            Value = new byte[GameConfig.GAME_STORAGE_SIZE];
        }

        public HexaGame(GameSharp game, BoardSharp[] boards) : this()
        {
            if (boards.Any(x => Utils.Bytes2HexString(x.GameId) != Utils.Bytes2HexString(game.GameId)))
                throw new InvalidOperationException($"Error while trying to create an HexaGame instance with different gameId ({game.GameId}/{boards.ToLog()})");

            if (boards.Length != game.Players.Length)
                throw new InvalidOperationException($"Inconsistent boards count (={boards.Length}) and players count (={game.Players.Length})");

            
            Id = game.GameId;

            switch(game.State)
            {
                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.GameState.Matchmaking:
                    HexBoardState = HexBoardState.Preparing;
                    break;
                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.GameState.Playing:
                    HexBoardState = HexBoardState.Running;
                    break;
                case NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.GameState.Finished:
                    HexBoardState = HexBoardState.Finish;
                    break;
            }

            HexBoardRound = game.Round;
            PlayerTurn = game.PlayerTurn;
            SelectBase = game.SelectionSize;
            UnboundTiles = game.Selection.Select(x => (HexaTile)x).ToList();

            // Assume that board and players are ordered
            HexaTuples = new List<(HexaPlayer, HexaBoard)>();
            foreach (var (board, playerAddress) in boards.Zip(game.Players, (b, p) => (b, p)))
            {
                var hexTiles = board.HexGrid.Select(x => new HexaTile(x));
                var currentBoard = new HexaBoard(hexTiles.Select(x => x.Value).ToArray());

                var ressources = new List<byte>()
                {
                    board.Mana,
                    board.Humans,
                    board.Water,
                    board.Food,
                    board.Wood,
                    board.Stone,
                    board.Gold
                };

                var currentPlayer = new HexaPlayer(Utils.GetPublicKeyFrom(playerAddress), ressources.ToArray());

                HexaTuples.Add((currentPlayer, currentBoard));
            }

            PlayersCount = (byte)HexaTuples.Count;

        }

        public HexaGame(byte[] id, List<(HexaPlayer, HexaBoard)> hexaTuples) : this()
        {
            Id = id;

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
            PlayerTurn = 0;
            SelectBase = 2;

            UnboundTiles = RenewSelection(blockNumber, SelectBase);
        }

        public void NextRound(uint blockNumber)
        {
            HexaTuples.ForEach(p => { p.player.NextRound(blockNumber); p.board.NextRound(blockNumber); });

            PlayerTurn = 0;
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
                    Log.Debug($"Selection is now {SelectBase}");
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

                result.Add(new HexaTile(values[rawTile % values.Length], TileRarity.Normal, TilePattern.Normal));
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
            if (!EnsureCurrentPlayer(playerIndex))
            {
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
                Log.Error("Player {playerNum} does not have enough mana to play (current mana = {manaValue}", PlayerTurn, hexaPlayer[RessourceType.Mana]);

                return false;
            }

            // check if tile can be placed
            try
            {
                if (!hexaBoard.Place(coords, chooseTile))
                {
                    return false;
                }
            } 
            catch(InvalidMapCoordinate ex)
            {
                Log.Error(ex.Message);
                return false;
            }

            // on a successful place do the storage changes
            hexaPlayer[RessourceType.Mana] -= 1; // Todo : change by mana cost instead of 1

            UnboundTiles.RemoveAt(selectionIndex);
            Log.Debug("UnboundTile num {num} succesfully removed", selectionIndex);

            // Set Patterns (can be optimized to only set around the played tile)
            //hexaBoard.SetPatterns();
            hexaBoard.SetPatterns(coords);

            return true;
        }

        internal bool UpgradeTile(byte playerIndex, (int q, int r) coords)
        {
            if (!EnsureCurrentPlayer(playerIndex))
            {
                return false;
            }

            HexaBoard hexaBoard = HexaTuples[PlayerTurn].board;
            HexaPlayer hexaPlayer = HexaTuples[PlayerTurn].player;

            // Ensure coord have a valid tile
            var existingTile = (HexaTile)hexaBoard[coords.q, coords.r];

            if (existingTile.TileType == TileType.Empty)
            {
                Log.Warning("Cannot upgrade tile ({q, r}) because it not a valid tile", coords.q, coords.r);
                return false;
            }

            // Check if player have enought ressources to upgrade
            var goldRequired = GameConfig.GoldCostForUpgrade(existingTile.TileRarity);
            var humansRequired = GameConfig.MininumHumanToUpgrade(existingTile.TileRarity);
            if (hexaPlayer[RessourceType.Gold] < goldRequired ||
                hexaPlayer[RessourceType.Humans] < humansRequired)
            {
                Log.Warning("Player {playerId} does not have enough Gold ({currentGold}) or Humans ({currentHuman}) to upgrade {tileRarity} (required {goldRequired} gold and {humanRequired})", PlayerTurn, hexaPlayer[RessourceType.Gold], hexaPlayer[RessourceType.Humans], existingTile.TileRarity, goldRequired, humansRequired);

                return false;
            }

            // Upgrade tile to next level
            var canUpgrade = existingTile.Upgrade();

            if (!canUpgrade)
                return false;

            HexaTuples[PlayerTurn].board[coords.q, coords.r] = existingTile;
            hexaPlayer[RessourceType.Gold] -= (byte)goldRequired;
            hexaPlayer[RessourceType.Humans] -= (byte)humansRequired;

            return true;
        }

        internal bool UpdateTurnState(uint blockNumber, byte playerIndex)
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

            return true;
        }

        //internal void UpdateRound(uint blockNumber)
        //{
        //    Log.Information($"BlockNumber = {blockNumber} - End of round {HexBoardRound}, add {GameConfig.FREE_MANA_PER_ROUND} mana to each player and start a new round");

        //    // add 1 mana to all players
        //    HexaTuples.ForEach(p =>
        //    {
        //        p.Item1[RessourceType.Mana] += GameConfig.FREE_MANA_PER_ROUND;
        //    });

        //    PlayerTurn = 0;
        //    HexBoardRound += 1;
        //}

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
                    result = byte.MaxValue; //(byte)(boardStats[TileType.Home] * 1); // 1 Humans start in the Home

                    // Physiological needs: breathing, food, water, shelter, clothing, sleep
                    result = (byte)Math.Min(result, player[RessourceType.Water] * GameConfig.WATER_PER_HUMANS);
                    result = (byte)Math.Min(result, player[RessourceType.Food] * GameConfig.FOOD_PER_HUMANS);

                    var homeWeighted = 0;
                    foreach (TileRarity rarity in Enum.GetValues(typeof(TileRarity)))
                    {
                        homeWeighted += (int)rarity * boardStats[TileType.Home, rarity];
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

        public HexaGame Clone()
        {
            var gameId = (byte[])this.Id.Clone();
            var players = this.HexaTuples.Select(x => (x.player.Clone(), x.board.Clone())).ToList();

            var cloneGame = new HexaGame(gameId, players);

            cloneGame.HexBoardState = this.HexBoardState;
            cloneGame.HexBoardRound = this.HexBoardRound;
            cloneGame.PlayerTurn = this.PlayerTurn;
            cloneGame.SelectBase = this.SelectBase;

            cloneGame.UnboundTiles = this.UnboundTiles.Select(x => x.Clone()).ToList();

            return cloneGame;
        }

        public override string ToString()
        {
            string log = $"HexaGame value :";

            log += $"\n\t Id = {Utils.Bytes2HexString(Id)}";
            log += $"\n\t HexBoardState = {HexBoardState}";
            log += $"\n\t HexBoardRound = {HexBoardRound}";
            log += $"\n\t PlayerTurn = {PlayerTurn}";
            log += $"\n\t UnboundTiles.Length = {UnboundTiles.Count}";

            log += $"\n\t Nb players = {PlayersCount}";
            for(int i = 0; i < PlayersCount; i++)
            {
                log += $"\n\t\t Player {i} = {HexaTuples[i].player.Id.ToAddress()}";
            }

            return log;
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
    }
}