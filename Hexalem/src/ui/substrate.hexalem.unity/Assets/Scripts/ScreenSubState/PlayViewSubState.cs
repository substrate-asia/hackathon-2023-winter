using Assets.Scripts.ScreenStates;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts
{
    internal class PlayViewSubState : ScreenBaseState
    {
        public PlayScreenState MainScreenState => ParentState as PlayScreenState;

        private ScrollView _scvSelection;
        private Label _lblActionInfo;

        public PlayViewSubState(FlowController flowController, ScreenBaseState parent)
            : base(flowController, parent) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] EnterState");

            var floatBody = FlowController.VelContainer.Q<VisualElement>("FloatBody");
            floatBody.Clear();

            TemplateContainer elementInstance = ElementInstance("UI/Frames/PlaySelectFrame");
            
            _scvSelection = elementInstance.Q<ScrollView>("ScVSelection");
            _lblActionInfo = elementInstance.Q<Label>("LblActionInfo");

            // add element
            floatBody.Add(elementInstance);

            AddTileToSelection();
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}][SUB] ExitState");
        }

        public void AddTileToSelection()
        {

            TemplateContainer tileCard = ElementInstance("UI/Elements/TileCardElement");
            _scvSelection.Add(tileCard);

            _lblActionInfo.text = $"1/1 Tile(s) available";
        }

    }
}