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
    }
}