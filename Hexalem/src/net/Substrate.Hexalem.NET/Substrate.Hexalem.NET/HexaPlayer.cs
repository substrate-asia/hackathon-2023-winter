namespace Substrate.Hexalem
{
    public partial class HexaPlayer : IHexaBase
    {
        public static implicit operator byte[](HexaPlayer p) => p.Value;

        public static implicit operator HexaPlayer(byte[] p) => new HexaPlayer(p);

        public byte[] Id { get; set; } // AccountId32

        public byte[] Value { get; set; }

        public HexaPlayer(byte[] id) : this(id, new byte[GameConfig.PLAYER_STORAGE_SIZE])
        {
            Value = new byte[GameConfig.PLAYER_STORAGE_SIZE];
            AddWinCondition(Hexalem.WinningCondition.HumanThreshold);
        }

        public HexaPlayer(byte[] id, byte[] hash)
        {
            Id = id;
            Value = hash;
        }

        public byte this[RessourceType ressourceType]
        {
            get => Value[(int)ressourceType];
            set => Value[(int)ressourceType] = value;
        }

        public void Init(uint blockNumber)
        {
            this[RessourceType.Mana] = GameConfig.DEFAULT_MANA;
            this[RessourceType.Humans] = GameConfig.DEFAULT_HUMANS;
            this[RessourceType.Water] = GameConfig.DEFAULT_WATER;
            this[RessourceType.Food] = GameConfig.DEFAULT_FOOD;
            this[RessourceType.Wood] = GameConfig.DEFAULT_WOOD;
            this[RessourceType.Stone] = GameConfig.DEFAULT_STONE;
            this[RessourceType.Gold] = GameConfig.DEFAULT_GOLD;
        }

        public void AddWinCondition(WinningCondition condition)
        {
            switch (condition)
            {
                case Hexalem.WinningCondition.GoldThreshold:
                    WinningCondition = new HexaWinningCondition(condition, GameConfig.DEFAULT_WINNING_CONDITION_GOLD);
                    break;

                case Hexalem.WinningCondition.HumanThreshold:
                    WinningCondition = new HexaWinningCondition(condition, GameConfig.DEFAULT_WINNING_CONDITION_HUMAN);
                    break;
            }
        }

        /// <summary>
        /// Check if player reach his win condition
        /// </summary>
        /// <returns></returns>
        public bool HasWin()
        {
            switch (WinningCondition.WinningCondition)
            {
                case Hexalem.WinningCondition.GoldThreshold:
                    return this[RessourceType.Gold] >= WinningCondition.Target;

                case Hexalem.WinningCondition.HumanThreshold:
                    return this[RessourceType.Humans] >= WinningCondition.Target;
            }

            return false;
        }

        /// <summary>
        /// Check if player can do anything
        /// </summary>
        /// <returns></returns>
        public bool CanPlay()
        {
            return this[RessourceType.Mana] > 0;
        }

        public bool CanBuy(HexaTile tile)
        {
            // For now, every tile cost 1 mana, but need to adapt wit Rosta cost material
            return this[RessourceType.Mana] > 0;
        }

        /// <summary>
        /// Check if player has enough ressources to upgrade tile
        /// </summary>
        /// <returns></returns>
        public bool CanUpgrade(HexaTile tile)
        {
            return this[RessourceType.Gold] >= GameConfig.GoldCostForUpgrade(tile.TileLevel) &&
                    this[RessourceType.Humans] >= GameConfig.MininumHumanToUpgrade(tile.TileLevel);
        }

        public void NextRound(uint blockNumber)
        {
        }

        public void PostMove(uint blockNumber)
        {
        }

        internal HexaPlayer Clone()
        {
            var clonePlayer = new HexaPlayer((byte[])Id.Clone(), (byte[])Value.Clone());
            clonePlayer.WinningCondition = new HexaWinningCondition(WinningCondition.WinningCondition, WinningCondition.Target);

            return clonePlayer;
        }
    }

    public partial class HexaPlayer
    {
        /// <summary>
        /// Winning condition selected by the player
        /// </summary>
        public HexaWinningCondition WinningCondition
        {
            get => (HexaWinningCondition)Value[7];
            set => Value[7] = value;
        }
    }
}