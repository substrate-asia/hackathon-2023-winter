using Substrate.NET.Wallet;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class AccountSelectionState : ScreenBaseState
    {
        public AccountSelectionState(FlowController _flowController)
            : base(_flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            var visualTreeAsset = Resources.Load<VisualTreeAsset>("UI/Screens/AccountsScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);
            
            var velReturnBox = instance.Q<VisualElement>("VelReturnBox");
            velReturnBox.style.visibility = Visibility.Visible;
            velReturnBox.RegisterCallback<ClickEvent>(OnClickReturn);

            var lblSubTitle = instance.Q<Label>("LblSubTitle");
            lblSubTitle.text = "Select an account";
            var scvAccounts = instance.Q<VisualElement>("VelAccountsBox");

            foreach (var wallet in Network.StoredWallets())
            {
                var walletVisualTree = Resources.Load<VisualTreeAsset>("UI/Elements/AccountFullElement");
                var walletInstance = walletVisualTree.Instantiate();
                walletInstance.style.width = new Length(100, LengthUnit.Percent);
                walletInstance.style.height = new Length(300, LengthUnit.Pixel);
                var lblAccountName = walletInstance.Q<Label>("LblAccountName");
                var lblAccountAddress = walletInstance.Q<Label>("LblAccountAddress");
                var velContentBox = walletInstance.Q<VisualElement>("VelContentBox");
                velContentBox.RegisterCallback<ClickEvent>((evt) => OnClickVelSelectAccount(evt, wallet));
                lblAccountName.text = wallet.FileName;
                lblAccountAddress.text = wallet.Account.Value;
                scvAccounts.Add(walletInstance);
            }

            var btCreateButton = instance.Q<Button>("BtnCreateWallet");
            btCreateButton.SetEnabled(true);
            btCreateButton.RegisterCallback<ClickEvent>(OnClickBtnCreateWallet);

            // add container
            FlowController.VelContainer.Add(instance);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            FlowController.VelContainer.RemoveAt(1);
        }

        private void OnClickBtnCreateWallet(ClickEvent evt)
        {
            FlowController.ChangeScreenState(ScreenState.OnBoarding);
        }

        private void OnClickReturn(EventBase evt)
        {
            FlowController.ChangeScreenState(ScreenState.UnlockWallet);
        }

        private void OnClickVelSelectAccount(ClickEvent evt, Wallet wallet)
        {
            Debug.Log($"Loading the following {wallet.FileName} wallet");
            Network.ChangeWallet(wallet);

            FlowController.ChangeScreenState(ScreenState.UnlockWallet);
        }
    }
}