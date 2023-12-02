using System;
namespace Substrate.Hexalem.NET
{
	public class TileOffer
	{
		public HexaTile TileToBuy { get; set; }
		public MaterialCost TileCost { get; set; }
    }

	public class MaterialCost
	{
		public Material MaterialType { get; set; }
		public byte Cost { get; set; } // MaterialCost
	}

	public enum Material
	{
        Mana,
        Humans,
        Water,
        Food,
        Wood,
        Stone,
        Gold,
    }
}

