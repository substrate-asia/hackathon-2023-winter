using Substrate.Hexalem.Engine;
using UnityEngine;
using UnityEngine.UIElements;
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
            var cost = $"1{ResourceTypIcon(RessourceType.Mana)}";

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

                RessourceType resourceType = (RessourceType)i;

                if (produce != "")
                {
                    produce += ", ";
                }

                if (rawHumanRequirements[i].Value == 0)
                {
                    produce += $"{rawProduces[i].Value} {ResourceTypIcon(resourceType)}";
                }
                else
                {
                    produce += $"{rawProduces[i].Value}{ResourceTypIcon(resourceType)}" +
                        $" but needs {rawHumanRequirements[i].Value}{ResourceTypIcon(RessourceType.Humans)}";
                }
            }
            
            string produceString = produce != "" ? $"{tileType} tiles produce {produce}" : "";

            return $"The {tileType} tile costs {cost}.\r\n\r\n{produceString}";
        }
        public static string ResourceTypIcon(RessourceType resourceType)
        {
            switch (resourceType)
            {
                case RessourceType.Mana:
                    return "<sprite=\"icon_res_mana\" index=0>";
                case RessourceType.Humans:
                    return "<sprite=\"icon_res_human\" index=0>";
                case RessourceType.Water:
                    return "<sprite=\"icon_res_food\" index=0>";
                case RessourceType.Food:
                    return "<sprite=\"icon_res_water\" index=0>";
                case RessourceType.Wood:
                    return "<sprite=\"icon_res_wood\" index=0>";
                case RessourceType.Stone:
                    return "<sprite=\"icon_res_stone\" index=0>";
                case RessourceType.Gold:
                    return "<sprite=\"icon_res_gold\" index=0>";
            }
            return "";
        }
    }
}