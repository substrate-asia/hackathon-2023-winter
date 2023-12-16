using Substrate.Hexalem.Engine;
using UnityEngine;
using UnityEngine.UIElements;
using Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet;
using Substrate.Hexalem.NET.NetApiExt.Generated.Storage;

namespace Assets.Scripts
{
    public static class HelperUI
    {
        public static TemplateContainer InstanceFrom(string path)
        {
            var visualTreeAsset = Resources.Load<VisualTreeAsset>(path);
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(100, LengthUnit.Percent);
            return instance;
        }

        public static string TileLevelName(byte tileLevel)
        {
            switch (tileLevel)
            {
                case 0:
                    return "Norm";

                case 1:
                    return "Rare";

                case 2:
                    return "Epic";

                case 3:
                    return "Lege";

                default:
                    return "Norm";
            }
        }

        public static string TileDescription(Substrate.Hexalem.Engine.TileType tileType)
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
            
            string produceString = produce != "" ? $"{tileType} tiles produce {produce}" : "";

            return $"The {tileType} tile costs {cost}.\r\n\r\n{produceString}";
        }
        public static string ResourceTypeColor(ResourceType resourceType)
        {
            switch (resourceType)
            {
                case ResourceType.Mana:
                    return "blue";
                case ResourceType.Human:
                    return "#CFB997";
                case ResourceType.Food:
                    return "#7CFC00";
                case ResourceType.Water:
                    return "#ADD8E6";
                case ResourceType.Wood:
                    return "#964B00";
                case ResourceType.Stone:
                    return "#888888";
                case ResourceType.Gold:
                    return "#DBAC34";
            }
            return "";
        }
    }
}