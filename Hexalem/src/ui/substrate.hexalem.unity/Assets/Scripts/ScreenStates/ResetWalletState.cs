using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class ResetWalletState : ScreenBaseState
    {
        private Button _btnDeleteWallet;

        public ResetWalletState(FlowController _flowController)
            : base(_flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/ResetScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);
            var velReturnBox = instance.Q<VisualElement>("VelReturnBox");
            velReturnBox.style.visibility = Visibility.Visible;
            var lblSubTitle = instance.Q<Label>("LblSubTitle");
            lblSubTitle.text = "Wallet Reset";

            var lblAccountName = instance.Q<Label>("LblAccountName");
            var lblAccountAddress = instance.Q<Label>("LblAccountAddress");
            lblAccountName.text = Network.Wallet.FileName;
            lblAccountAddress.text = Network.Wallet.Account.Value;

            // add manipulators
            velReturnBox.RegisterCallback<ClickEvent>(OnClickReturn);
            _btnDeleteWallet = instance.Q<Button>("BtnDeleteWallet");
            _btnDeleteWallet.SetEnabled(false);
            _btnDeleteWallet.RegisterCallback<ClickEvent>(OnClickBtnDeleteWallet);
            var txfActionVerification = instance.Q<CustomTextField>("TxfActionVerification");
            txfActionVerification.TextField.RegisterValueChangedCallback(OnChangeEventActionVerification);

            // add container
            FlowController.VelContainer.Add(instance);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            FlowController.VelContainer.RemoveAt(1);
        }

        private void OnClickReturn(ClickEvent evt)
        {
            FlowController.ChangeScreenState(ScreenState.UnlockWallet);
        }

        private void OnClickBtnDeleteWallet(ClickEvent evt)
        {
            Debug.Log("[DeleteWallet] clicked.");
        }

        private void OnChangeEventActionVerification(ChangeEvent<string> evt)
        {
            if (evt.newValue == "DELETE WALLET")
            {
                Color color = new Color32(0xF6, 0x1D, 0x51, 255);
                _btnDeleteWallet.style.backgroundColor = color;
                _btnDeleteWallet.SetEnabled(true);
            }
            else
            {
                Color color = new Color32(0xFD, 0xD2, 0xDC, 255);
                _btnDeleteWallet.style.backgroundColor = color;
                _btnDeleteWallet.SetEnabled(false);
            }
        }
    }
}