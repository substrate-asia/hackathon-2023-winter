namespace Substrate.Hexalem.Engine
{
    public class GameResult
    {
        private GameResult()
        { }

        public GameEnd GameEnd { get; set; }
        public HexaPlayer? Winner { get; set; }

        public static GameResult PlayerWinByReachingWinCondition(HexaPlayer winner)
        {
            return new GameResult()
            {
                GameEnd = GameEnd.PlayerWin,
                Winner = winner
            };
        }

        public static GameResult PlayerWinByOpponentAfk(HexaPlayer winner)
        {
            return new GameResult()
            {
                GameEnd = GameEnd.RageQuit,
                Winner = winner
            };
        }

        public static GameResult TieGame()
        {
            return new GameResult()
            {
                GameEnd = GameEnd.Tie,
                Winner = null
            };
        }
    }

    public enum GameEnd
    {
        /// <summary>
        /// Player win by reaching his WinCondition
        /// </summary>
        PlayerWin,

        /// <summary>
        /// Every player has his board full
        /// </summary>
        Tie,

        /// <summary>
        /// A player play too slowly or ragequit
        /// </summary>
        RageQuit
    }
}