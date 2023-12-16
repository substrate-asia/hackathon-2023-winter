using Assets.Scripts.ScreenStates;
using Substrate.Hexalem.Engine;
using UnityEngine;
using UnityEngine.UIElements;

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
            switch(tileLevel)
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

        public static string TileDescription(TileType tileType)
        {
            switch (tileType)
            {
                case TileType.Home:
                    return "The Cave tile, will cost <color=blue>1 Mana</color>.\r\n\r\n" +
                           "Cave tiles produce <color=grey>1 Stone</color> per round when deployed alone, patterns can create mines and other things.";
                case TileType.Grass:
                    return "The Cave tile, will cost 1 Mana.\r\n\r\n" +
                           "Cave tiles produce 1 Stone per round when deployed alone, patterns can create mines and other things.\r\n" +
                           "blah blah blah blah blah blah blah blah\r\nblah blah blah blah blah blah blah blah";
                case TileType.Water:
                    return "The Cave tile, will cost 1 Mana.\r\n\r\n" +
                           "Cave tiles produce 1 Stone per round when deployed alone, patterns can create mines and other things.\r\n" +
                           "blah blah blah blah blah blah blah blah\r\nblah blah blah blah blah blah blah blah";
                case TileType.Mountain:
                    return "The Cave tile, will cost 1 Mana.\r\n\r\n" +
                           "Cave tiles produce 1 Stone per round when deployed alone, patterns can create mines and other things.\r\n" +
                           "blah blah blah blah blah blah blah blah\r\nblah blah blah blah blah blah blah blah";
                case TileType.Tree:
                    return "The Cave tile, will cost 1 Mana.\r\n\r\n" +
                           "Cave tiles produce 1 Stone per round when deployed alone, patterns can create mines and other things.\r\n" +
                           "blah blah blah blah blah blah blah blah\r\nblah blah blah blah blah blah blah blah";
                case TileType.Desert:
                    return "The Cave tile, will cost 1 Mana.\r\n\r\n" +
                           "Cave tiles produce 1 Stone per round when deployed alone, patterns can create mines and other things.\r\n" +
                           "blah blah blah blah blah blah blah blah\r\nblah blah blah blah blah blah blah blah";
                case TileType.Cave:
                    return "The Cave tile, will cost 1 Mana.\r\n\r\n" +
                           "Cave tiles produce 1 Stone per round when deployed alone, patterns can create mines and other things.\r\n" +
                           "blah blah blah blah blah blah blah blah\r\nblah blah blah blah blah blah blah blah";
                case TileType.Empty:
                default:
                    return "The Empty tile, is a sureal solution fo be placed and the mana cost is infinit. cost 1 Mana.";
            }
        }
    }
}