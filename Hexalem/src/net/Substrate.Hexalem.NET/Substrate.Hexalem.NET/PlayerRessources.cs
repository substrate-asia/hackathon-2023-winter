using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.NET
{
    public class PlayerRessources
    {
        public PlayerRessources(byte mana, byte human, byte gold, byte food, byte wood, byte water)
        {
            Mana = mana;
            Human = human;
            Gold = gold;
            Food = food;
            Wood = wood;
            Water = water;
        }

        public static PlayerRessources Default()
        {
            return new PlayerRessources(
                GameConfig.DefaultMana,
                GameConfig.DefaultHuman,
                GameConfig.DefaultGold,
                GameConfig.DefaultFood,
                GameConfig.DefaultWood,
                GameConfig.DefaultWater);
        }

        public byte Mana { get; set; }
        public byte Human { get; set; }
        public byte Gold { get; set; }
        public byte Food { get; set; }
        public byte Wood { get; set; }
        public byte Water { get; set; }


    }
}
