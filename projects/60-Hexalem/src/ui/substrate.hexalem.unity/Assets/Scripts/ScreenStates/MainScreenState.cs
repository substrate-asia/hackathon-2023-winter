using Substrate.Integration;
using System.Numerics;
using System.Threading;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class MainScreenState : ScreenBaseState
    {
        private Label _lblAccount;
        private Label _lblAddress;
        private Label _lblToken;

        private Label _lblNodeVersion;
        private Label _lblNodeUrl;
        private Label _lblConnection;
        private Label _lblBlockNumber;

        public MainScreenState(FlowController _flowController)
            : base(_flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            // filler is to avoid camera in the ui
            var topFiller = FlowController.VelContainer.Q<VisualElement>("VelTopFiller");
            topFiller.style.backgroundColor = GameConstant.ColorDark;

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/MainScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);

            var topBound = instance.Q<VisualElement>("TopBound");

            _lblAccount = topBound.Query<Label>("LblAccount");
            _lblAddress = topBound.Query<Label>("LblAddress");
            _lblToken = topBound.Query<Label>("LblToken");

            _lblNodeUrl = topBound.Query<Label>("LblNodeUrl");
            _lblNodeUrl.text = Network.CurrentNodeType.ToString();
            _lblNodeVersion = topBound.Query<Label>("LblNodeVersion");
            _lblConnection = topBound.Query<Label>("LblConnection");
            _lblBlockNumber = topBound.Query<Label>("LblBlockNumber");

            // add container
            FlowController.VelContainer.Add(instance);

            // load initial sub state
            FlowController.ChangeScreenSubState(ScreenState.MainScreen, ScreenSubState.MainChoose);



            // subscribe to connection changes
            Network.ConnectionStateChanged += OnConnectionStateChanged;
            Storage.OnNextBlocknumber += UpdateBlocknumber;

            // connect to substrate node
            Network.Client.ConnectAsync(true, true, CancellationToken.None);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            // unsubscribe from event
            Network.ConnectionStateChanged -= OnConnectionStateChanged;
            Storage.OnNextBlocknumber -= UpdateBlocknumber;

            // remove container
            FlowController.VelContainer.RemoveAt(1);
        }

        private void OnConnectionStateChanged(bool IsConnected)
        {
            if (IsConnected)
            {
                _lblConnection.text = "Online";
                //_lblConnection.style.unityTextOutlineColor = GameConstant.PastelGreen;
            }
            else
            {
                _lblConnection.text = "Offline";
                //_lblConnection.style.unityTextOutlineColor = GameConstant.PastelRed;
            }
        }

        private void UpdateBlocknumber(uint blocknumber)
        {
            _lblBlockNumber.text = blocknumber.ToString();

            if (Network.Client.Account != null)
            {
                _lblAccount.text = Network.CurrentAccountType.ToString();
                Debug.Log(Network.Client.Account.Value);
                var address = Network.Client.Account.Value;
                _lblAddress.text = address.Substring(0, 6) + " ... " + address.Substring(20, 6);
            }
            else
            {
                //_lblAccount.text = "...";
            }

            if (Storage.AccountInfo != null && Storage.AccountInfo.Data != null)
            {
                _lblToken.text = GameConstant.BalanceFormatter(BigInteger.Divide(Storage.AccountInfo.Data.Free, new BigInteger(SubstrateNetwork.DECIMALS))) + " HEXA";
                var specName = Network.Client.SubstrateClient.RuntimeVersion.SpecName;
                _lblNodeVersion.text = specName.Length > 20 ? $"{specName[..17]}..." : specName;
            }
            else
            {
                //_lblToken.text = ".";
            }
        }
    }
}