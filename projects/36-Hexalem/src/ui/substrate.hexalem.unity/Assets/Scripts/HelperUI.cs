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

        public static string TileDescription(TileOffer selectTile)
        {
            var cost = $"{selectTile.SelectCost.Cost}{ResourceTypeIcon(selectTile.SelectCost.MaterialType)}";

            var hexalemConstants = new HexalemModuleConstants();

            var produce = "";
    
            var tileProduction = HexalemConfig.GetInstance().MapTileProduction[selectTile.TileToBuy.TileType][selectTile.TileToBuy.TilePattern];
            var rawProduces = tileProduction[selectTile.TileToBuy.TileLevel];
            var rawHumanRequirements = tileProduction[tileProduction.Count - 1]; ;


            for (int i = 0; i < rawProduces.Length; i++)
            {
                if (rawProduces[i] == 0)
                {
                    continue;
                }

                RessourceType resourceType = (RessourceType)i;

                if (produce != "")
                {
                    produce += ", ";
                }

                if (rawHumanRequirements[i] == 0)
                {
                    produce += $"{rawProduces[i]} {ResourceTypeIcon(resourceType)}";
                }
                else
                {
                    produce += $"{rawProduces[i]}{ResourceTypeIcon(resourceType)}" +
                        $" but needs {rawHumanRequirements[i]}{ResourceTypeIcon(RessourceType.Humans)}";
                }
            }
            
            string produceString = produce != "" ? $"{selectTile.TileToBuy.TileType} tiles produce {produce}" : "";

            return $"The {selectTile.TileToBuy.TileType} tile costs {cost}.\r\n\r\n{produceString}";
        }

        public static string TileUpgradeDescription(HexaPlayer player, HexaTile tileToUpgrade)
        {
            var upgradeCosts = HexalemConfig.GetInstance().MapTileUpgradeCost;

            if (upgradeCosts.ContainsKey(tileToUpgrade.TileType) && tileToUpgrade.TileLevel < upgradeCosts[tileToUpgrade.TileType].Count)
            {
                var upgradeCost = upgradeCosts[tileToUpgrade.TileType][tileToUpgrade.TileLevel];

                string cost = "";

                for (int i = 0; i < upgradeCost.Length; i++)
                {
                    if (upgradeCost[i] == 0)
                    {
                        continue;
                    }

                    RessourceType resourceType = (RessourceType)i;

                    if (player[resourceType] >= upgradeCost[i])
                    {
                        cost += $"\n\t{upgradeCost[i]} {resourceType}{ResourceTypeIcon(resourceType)}";
                    }
                    else
                    {
                        cost += $"\n\t<color=red>{upgradeCost[i]} {resourceType}{ResourceTypeIcon(resourceType)}</color>";
                    }
                }

                return $"The {tileToUpgrade.TileType} tile upgrade costs: {cost}";
            }

            return $"The {tileToUpgrade.TileType} tile can not be upgraded.";
        }

        public static string ResourceTypeIcon(RessourceType resourceType)
        {
            switch (resourceType)
            {
                case RessourceType.Mana:
                    return "<sprite=\"icon_res_mana\" index=0>";
                case RessourceType.Humans:
                    return "<sprite=\"icon_res_human\" index=0>";
                case RessourceType.Water:
                    return "<sprite=\"icon_res_water\" index=0>";
                case RessourceType.Food:
                    return "<sprite=\"icon_res_food\" index=0>";
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