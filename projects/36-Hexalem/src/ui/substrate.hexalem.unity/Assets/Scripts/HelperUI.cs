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
    }
}