using System.Numerics;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    public static class GameConstant
    {
        public const float TileRatio = 0.3599393f;
        public static StyleColor ColorMythical => new StyleColor(new Color32(211, 194, 42, 255));
        public static StyleColor ColorLegendary => new StyleColor(new Color32(211, 116, 42, 255));
        public static StyleColor ColorEpic => new StyleColor(new Color32(165, 95, 255, 255));
        public static StyleColor ColorRare => new StyleColor(new Color32(36, 148, 214, 255));
        public static StyleColor ColorUncommon => new StyleColor(new Color32(186, 236, 215, 255));
        public static StyleColor ColorCommon => new StyleColor(new Color32(125, 125, 125, 255));

        public static StyleColor ColorNone => new StyleColor(new Color32(202, 202, 202, 255));

        public static StyleColor ColorLightGrey => new StyleColor(new Color32(236, 235, 233, 255));
        public static StyleColor ColorDarkGrey => new StyleColor(new Color32(105, 105, 105, 255));

        public static StyleColor ColorGrey => new StyleColor(new Color32(202, 202, 202, 255));
        public static StyleColor ColorDark => new StyleColor(new Color32(0, 0, 0, 255));
        public static StyleColor ColorLight => new StyleColor(new Color32(255, 255, 255, 255));

        public static StyleColor ColorOrange => new StyleColor(new Color32(248, 156, 121, 255));
        public static StyleColor ColorGreen => new StyleColor(new Color32(111, 207, 151, 255));

        public static StyleColor ColorTransparent => new StyleColor(new Color32(0, 0, 0, 0));

        public static StyleColor ColorExtrinsic => new StyleColor(new Color32(95, 88, 88, 255));
        public static StyleColor ColorExtrinsicRunning => new StyleColor(new Color32(188, 187, 187, 255));
        public static StyleColor ColorExtrinsicSuccess => new StyleColor(new Color32(26, 189, 121, 255));
        public static StyleColor ColorExtrinsicSuccessDark => new StyleColor(new Color32(17, 60, 50, 255));
        public static StyleColor ColorExtrinsicFailed => new StyleColor(new Color32(219, 100, 100, 255));
        public static StyleColor ColorExtrinsicFailedDark => new StyleColor(new Color32(120, 45, 45, 255));

        public static StyleColor FontLight => new StyleColor(new Color32(255, 255, 255, 255));
        public static StyleColor FontGrey => new StyleColor(new Color32(127, 127, 127, 255));
        public static StyleColor FontDark => new StyleColor(new Color32(0, 0, 0, 255));


        public static string BalanceFormatter(BigInteger bigInteger)
        {
            if (bigInteger < 1000)
            {
                return bigInteger.ToString();
            }
            else if (bigInteger < 1000000)
            {
                // Convert to decimal for proper division and formatting.
                decimal value = (decimal)bigInteger / 1000;
                return $"{value:F1}K"; // Formats to one decimal place.
            }
            else
            {
                // Convert to decimal for proper division and formatting.
                decimal value = (decimal)bigInteger / 1000000;
                return $"{value:F1}M"; // Formats to one decimal place.
            }
        }

        //internal static StyleColor GetColor(RarityType rarity)
        //{
        //    switch (rarity)
        //    {
        //        case RarityType.Common:
        //            return GameConstant.ColorCommon;

        //        case RarityType.Uncommon:
        //            return GameConstant.ColorUncommon;

        //        case RarityType.Rare:
        //            return GameConstant.ColorRare;

        //        case RarityType.Epic:
        //            return GameConstant.ColorEpic;

        //        case RarityType.Legendary:
        //            return GameConstant.ColorLegendary;

        //        case RarityType.Mythical:
        //            return GameConstant.ColorMythical;

        //        default:
        //            return GameConstant.ColorNone;
        //    }
        //}

        //internal static StyleColor GetColor(TransactionEvent transactionEvent)
        //{
        //    switch (transactionEvent)
        //    {
        //        case TransactionEvent.Validated:
        //            return ColorExtrinsicRunning;

        //        case TransactionEvent.Broadcasted:
        //            return ColorExtrinsicRunning;

        //        case TransactionEvent.BestChainBlockIncluded:
        //            return ColorExtrinsicSuccess;

        //        case TransactionEvent.Finalized:
        //            return ColorExtrinsicSuccess;

        //        case TransactionEvent.Error:
        //            return ColorExtrinsicFailed;

        //        case TransactionEvent.Invalid:
        //            return ColorExtrinsicFailed;

        //        case TransactionEvent.Dropped:
        //            return ColorExtrinsicFailed;

        //        default:
        //            return new StyleColor(new Color32(95, 88, 88, 0));
        //    }
        //}

    }
}