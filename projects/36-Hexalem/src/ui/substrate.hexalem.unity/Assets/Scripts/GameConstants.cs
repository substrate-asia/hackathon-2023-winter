using Substrate.NetApi.Model.Rpc;
using System.Numerics;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    public static class GameConstant
    {
        public static StyleColor ColorMythical => new StyleColor(new Color32(211, 194, 42, 255));
        public static StyleColor ColorLegendary => new StyleColor(new Color32(211, 116, 42, 255));
        public static StyleColor ColorEpic => new StyleColor(new Color32(165, 95, 255, 255));
        public static StyleColor ColorRare => new StyleColor(new Color32(36, 148, 214, 255));
        public static StyleColor ColorUncommon => new StyleColor(new Color32(186, 236, 215, 255));
        public static StyleColor ColorCommon => new StyleColor(new Color32(125, 125, 125, 255));

        public static StyleColor ColorDark => new StyleColor(new Color32(0, 0, 0, 255));
        public static StyleColor ColorLight => new StyleColor(new Color32(255, 255, 255, 255));

        public static StyleColor PastelBlue => new StyleColor(new Color32(164, 182, 221, 255));
        public static StyleColor PastelYellow => new StyleColor(new Color32(255, 247, 165, 255));
        public static StyleColor PastelOrange => new StyleColor(new Color32(208, 146, 146, 255));
        public static StyleColor PastelPink => new StyleColor(new Color32(192, 148, 204, 255));
        public static StyleColor PastelRed => new StyleColor(new Color32(195, 120, 146, 255));
        public static StyleColor PastelGreen => new StyleColor(new Color32(162, 208, 192, 255));

        public static StyleColor PastelGray => new StyleColor(new Color32(207, 207, 207, 255));

        public static StyleColor ColorUnselected => new StyleColor(new Color32(200, 175, 150, 255));
        public static StyleColor ColorSelected => new StyleColor(new Color32(150, 200, 150, 255));

        public static StyleColor ColorExtrinsic => new StyleColor(new Color32(95, 88, 88, 255));
        public static StyleColor ColorExtrinsicRunning => new StyleColor(new Color32(188, 187, 187, 255));
        public static StyleColor ColorExtrinsicSuccess => new StyleColor(new Color32(26, 189, 121, 255));
        public static StyleColor ColorExtrinsicSuccessDark => new StyleColor(new Color32(17, 60, 50, 255));
        public static StyleColor ColorExtrinsicFailed => new StyleColor(new Color32(219, 100, 100, 255));
        public static StyleColor ColorExtrinsicFailedDark => new StyleColor(new Color32(120, 45, 45, 255));

        public static StyleColor FontDark => new StyleColor(new Color32(51, 51, 51, 255));

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

        internal static StyleColor GetColor(TransactionEvent transactionEvent)
        {
            switch (transactionEvent)
            {
                case TransactionEvent.Validated:
                    return PastelYellow;

                case TransactionEvent.Broadcasted:
                    return PastelYellow;

                case TransactionEvent.BestChainBlockIncluded:
                    return PastelYellow;

                case TransactionEvent.Finalized:
                    return PastelGreen;

                case TransactionEvent.Error:
                    return PastelRed;

                case TransactionEvent.Invalid:
                    return PastelRed;

                case TransactionEvent.Dropped:
                    return PastelOrange;

                default:
                    return new StyleColor(new Color32(95, 88, 88, 0));
            }
        }
    }
}