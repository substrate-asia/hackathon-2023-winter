namespace Substrate.Hexalem.NET.GameException
{
    public static class LogMessages
    {
        public static string InvalidPlayerTurn(byte currentPlayerIndex, byte realPlayerTurn)
            => $"Player num ${currentPlayerIndex} try to play while it is the turn of player ${realPlayerTurn}";

        public static string InvalidTileSelection(int selectionIndex)
            => $"Invalid tiles selection : choose ${selectionIndex} which is out of bounds";

        public static string TooMuchTimeToPlay(uint nbBlockToPlay)
            => $"Player decision was too long, {nbBlockToPlay} block passed since last move (max allowed : {GameConfig.MAX_TURN_BLOCKS} blocks)";

        public static string InvalidTileToUpgrade(HexaTile tile)
            => $"Cannot upgrade tile of {tile.TileType}, {tile.TileRarity} because it not a valid tile";

        public static string MissingRessourcesToUpgrade(HexaPlayer player, HexaTile tile, int goldRequired, int humansRequired)
            => $"Player {player.Id} does not have enough Gold ({player[RessourceType.Gold]}) or Humans ({player[RessourceType.Humans]}) to upgrade {tile.TileRarity} (required {goldRequired} gold and {humansRequired})";

        internal static string MissingRessourcesToPlay(HexaPlayer player, HexaTile tile, RessourceType ressourceType, byte cost)
            => $"Player {player.Id} does not have enough {ressourceType} ({player[ressourceType]}) to place {tile.TileType} (required {cost})";

        internal static string InvalidCoords(int q, int r)
            => $"Hex coordinates ({q}; {r}) are out of range";
    }
}