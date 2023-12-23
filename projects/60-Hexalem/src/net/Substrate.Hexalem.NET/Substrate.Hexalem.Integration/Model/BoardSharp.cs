using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using System.Linq;

namespace Substrate.Hexalem.Integration.Model
{
    public class BoardSharp
    {
        public BoardSharp(HexBoard result)
        {
            GameId = result.GameId.Value.Select(x => (byte)x).ToArray();
            Resources = result.Resources.Value.Select(x => (byte)x).ToArray();

            HexGrid = result.HexGrid.Value.Value.Select(x => new TileSharp(x)).ToArray();
        }

        public byte[] GameId { get; private set; }
        public byte[] Resources { get; private set; }
        public TileSharp[] HexGrid { get; private set; }
    }
}