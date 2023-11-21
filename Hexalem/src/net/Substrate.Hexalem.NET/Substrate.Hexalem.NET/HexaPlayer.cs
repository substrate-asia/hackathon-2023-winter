using Substrate.Hexalem.NET;
using System;

namespace Substrate.Hexalem
{
    public class HexaPlayer : IHexaBase
    {
        public static implicit operator byte[](HexaPlayer p) => p.Value;
        public static implicit operator HexaPlayer(byte[] p) => new HexaPlayer(p);

        public byte[] Value { get; set; }

        public HexaPlayer() : this(new byte[GameConfig.PLAYER_STORAGE_SIZE])
        {
            Value = new byte[GameConfig.PLAYER_STORAGE_SIZE];
        }

        public HexaPlayer(byte[] hash)
        {
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

        public void NextRound(uint blockNumber)
        {

        }

        public void PostMove(uint blockNumber)
        {

        }
    }
}