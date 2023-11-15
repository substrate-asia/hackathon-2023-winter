using Newtonsoft.Json.Linq;
using Substrate.Hexalem.NET.GameException;
using Substrate.NetApi;
using Substrate.NetApi.BIP39;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Substrate.Hexalem.NET
{
    public class HexPlayer
    {
        public byte[] Value { get; set; }
        public string Address { get; }
        public string? Name { get; set; }
        public PlayerRessources Ressources { get; private set; }

        public HexPlayer(string address, PlayerRessources ressources)
        {
            Address = address;
            Ressources = ressources;

            Value = Encode();
        }

        public HexPlayer(byte[] value)
        {
            Value = value;
            // Do we need to store Account address ?
            //Address = Utils.GetAddressFrom(Helper.ExtractSubArray(value, 0, GameConfig.PlayerAccountStorageSize));  // Should be be from AccountId32 I think
            Ressources = BuildRessources();
        }

        public HexPlayer AddName(string name)
        {
            Name = name;
            return this;
        }

        /// <summary>
        /// In game name of the player
        /// </summary>
        /// <returns></returns>
        public string DisplayName()
        {
            if(string.IsNullOrEmpty(Name))
            {
                return Address;
            }

            return Name;
        }

        public PlayerRessources BuildRessources()
        {
            var ressources = Helper.ExtractSubArray(Value, GameConfig.PlayerAccountStorageSize, 6);

            return new PlayerRessources(ressources[0], ressources[1], ressources[2], ressources[3], ressources[4], ressources[5]);
        }

        public byte[] Encode()
        {
            var result = new List<byte>();
            //result.AddRange(Utils.GetPublicKeyFrom(Address));
            result.Add(Ressources.Mana);
            result.Add(Ressources.Human);
            result.Add(Ressources.Gold);
            result.Add(Ressources.Food);
            result.Add(Ressources.Wood);
            result.Add(Ressources.Water);

            return result.ToArray();
        }
    }
}
