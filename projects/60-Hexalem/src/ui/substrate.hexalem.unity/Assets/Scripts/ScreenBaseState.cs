using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    public abstract class ScreenBaseState
    {
        public enum StepState
        {
            None,
            Current,
            Done
        }

        protected FlowController FlowController { get; private set; }

        protected ScreenBaseState ParentState { get; private set; }

        protected NetworkManager Network => NetworkManager.GetInstance();

        protected StorageManager Storage => StorageManager.GetInstance();

        protected GridManager Grid => GridManager.GetInstance();

        protected ScreenBaseState(FlowController flowController, ScreenBaseState parentState = null)
        {
            FlowController = flowController;
            ParentState = parentState;
        }

        public abstract void EnterState();

        public abstract void ExitState();

        internal TemplateContainer ElementInstance(string elementPath, int widthPerc = 100, int heightPerc = 100)
        {
            var element = Resources.Load<VisualTreeAsset>(elementPath);
            var elementInstance = element.Instantiate();
            elementInstance.style.width = new Length(widthPerc, LengthUnit.Percent);
            elementInstance.style.height = new Length(heightPerc, LengthUnit.Percent);
            return elementInstance;
        }
    }
}