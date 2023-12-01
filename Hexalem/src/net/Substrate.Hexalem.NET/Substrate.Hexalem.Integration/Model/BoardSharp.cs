using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using System.Linq;

namespace Substrate.Hexalem.Integration.Model
{
    public class BoardSharp
    {
        public BoardSharp(HexBoard result)
        {
            GameId = result.GameId.Value.Select(x => (byte)x).ToArray();
            Gold = result.Gold;
            Wood = result.Wood;
            Stone = result.Stone;
            Food = result.Food;
            Water = result.Water;
            Mana = result.Mana;
            Humans = result.Humans;

            HexGrid = result.HexGrid.Value.Value.Select(x => new TileSharp(x)).ToArray();
        }

        public byte[] GameId { get; private set; }
        public byte Gold { get; private set; }
        public byte Wood { get; private set; }
        public byte Stone { get; private set; }
        public byte Food { get; private set; }
        public byte Water { get; private set; }
        public byte Mana { get; private set; }
        public byte Humans { get; private set; }
        public TileSharp[] HexGrid { get; private set; }
    }
}