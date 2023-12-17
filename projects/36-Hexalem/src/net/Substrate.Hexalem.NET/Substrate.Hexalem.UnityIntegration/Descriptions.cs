using System;
using Substrate.Integration;

using Substrate.Hexalem.Engine;
using Substrate.Hexalem.NET.NetApiExt.Generated.Storage;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;

namespace Substrate.Hexalem.Integration
{
	public class Descriptions
	{
        public static string TileDescription(Engine.TileType tileType)
        {
            var cost = $"<color={ResourceTypeColor(ResourceType.Mana)}>1 Mana</color>";

            var hexalemConstants = new HexalemModuleConstants();

            var produce = "";

            var rawResourceProductions = hexalemConstants.TileResourceProductions().Value[(int)tileType];
            var rawProduces = rawResourceProductions.Produces.Value;
            var rawHumanRequirements = rawResourceProductions.HumanRequirements.Value;


            for (int i = 0; i < rawProduces.Length; i++)
            {
                if (rawProduces[i].Value == 0)
                {
                    continue;
                }

                ResourceType resourceType = (ResourceType)i;

                if (produce != "")
                {
                    produce += ", ";
                }

                if (rawHumanRequirements[i].Value == 0)
                {
                    produce += $"<color={ResourceTypeColor(resourceType)}>{rawProduces[i].Value} {resourceType}</color>";
                }
                else
                {
                    produce += $"<color={ResourceTypeColor(resourceType)}>{rawProduces[i].Value} {resourceType}" +
                        $"</color> but needs <color={ResourceTypeColor(ResourceType.Human)}>{rawHumanRequirements[i].Value} {ResourceType.Human}</color>";
                }
            }

            return $"The {tileType} tile costs {cost}.\r\n\r\n{tileType} tiles produce {produce}";
        }
        public static string ResourceTypeColor(ResourceType resourceType)
        {
            switch (resourceType)
            {
                case ResourceType.Mana:
                    return "blue";
                case ResourceType.Human:
                    return "beige";
                case ResourceType.Food:
                    return "green";
                case ResourceType.Water:
                    return "blue";
                case ResourceType.Wood:
                    return "brown";
                case ResourceType.Stone:
                    return "gray";
                case ResourceType.Gold:
                    return "yellow";
            }
            return "";
        }
    }
}

