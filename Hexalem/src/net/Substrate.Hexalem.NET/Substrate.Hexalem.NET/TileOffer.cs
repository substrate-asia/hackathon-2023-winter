namespace Substrate.Hexalem
{
    public class TileOffer
    {
        public HexaTile TileToBuy { get; set; }
        public MaterialCost TileCost { get; set; }
    }

    public class MaterialCost
    {
        public RessourceType MaterialType { get; set; }
        public byte Cost { get; set; } // MaterialCost
    }
}