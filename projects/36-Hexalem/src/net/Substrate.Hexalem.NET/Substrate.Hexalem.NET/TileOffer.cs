namespace Substrate.Hexalem.Engine
{
    public class TileOffer
    {
        public HexaTile TileToBuy { get; set; }
        public MaterialCost SelectCost { get; set; }
    }

    public class MaterialCost
    {
        public RessourceType MaterialType { get; set; }
        public byte Cost { get; set; } // MaterialCost
    }
}