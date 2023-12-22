namespace Substrate.Hexalem.Game
{
    public class PlayAction
    {
        private PlayAction()
        { }

        public bool CanPlay { get; set; }
        public int? SelectionIndex { get; set; } = null;
        public (int q, int r)? PlayTileAt { get; set; } = null;
        public (int q, int r)? UpgradeTileAt { get; set; } = null;

        public static PlayAction CannotPlay() => new PlayAction() { CanPlay = false };

        public static PlayAction Play(int index, (int, int) coords) => new PlayAction()
        {
            CanPlay = true,
            SelectionIndex = index,
            PlayTileAt = coords
        };

        public static PlayAction Upgrade((int, int) coords) => new PlayAction()
        {
            CanPlay = true,
            UpgradeTileAt = coords
        };
    }
}