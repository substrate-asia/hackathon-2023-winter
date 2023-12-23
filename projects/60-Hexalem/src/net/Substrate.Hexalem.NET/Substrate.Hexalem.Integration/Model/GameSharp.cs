using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_core.crypto;
using Substrate.Integration.Helper;
using Substrate.NetApi.Model.Types.Primitive;
using System.Linq;

namespace Substrate.Hexalem.Integration.Model
{
    public class GameSharp
    {
        public GameSharp(byte[] gameId, NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.Game game)
        {
            GameId = gameId;
            State = game.State.Value;
            Round = game.Round.Value;
            PlayerTurn = (byte)(game.PlayerTurnAndPlayed.Value & 0x7F);
            Played = ((game.PlayerTurnAndPlayed.Value & 0x80) >> 7) == 1;
            Players = ((AccountId32[])game.Players.Value).Select(p => p.ToAddress()).ToArray();
            Selection = ((U8[])game.Selection.Value).Select(p => p.Value).ToArray();
            SelectionSize = game.SelectionSize.Value;
            LastBlock = game.LastPlayedBlock.Value;
        }

        public byte[] GameId { get; private set; }
        public GameState State { get; private set; }
        public byte MaxRounds { get; private set; }
        public byte Round { get; private set; }
        public byte PlayerTurn { get; private set; }
        public bool Played { get; private set; }
        public string[] Players { get; private set; }
        public byte[] Selection { get; private set; }
        public byte SelectionSize { get; private set; }
        public uint LastBlock { get; private set; }
    }
}