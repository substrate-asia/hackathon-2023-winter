using Substrate.Integration;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
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

            _lblNodeVersion = topBound.Query<Label>("LblNodeVersion");
            _lblNodeUrl = topBound.Query<Label>("LblNodeUrl");
            _lblConnection = topBound.Query<Label>("LblConnection");
            _lblBlockNumber = topBound.Query<Label>("LblBlockNumber");

            // add container
            FlowController.VelContainer.Add(instance);

            // load initial sub state
            FlowController.ChangeScreenSubState(ScreenState.MainScreen, ScreenSubState.Choose);

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
        }

        private void OnConnectionStateChanged(bool IsConnected)
        {
            if (IsConnected)
            {
                _lblConnection.text = "CONNECTED";
                _lblConnection.style.color = GameConstant.ColorGreen;
            }
            else
            { 
                _lblConnection.text = "DISCONNECTED";
                _lblConnection.style.color = GameConstant.ColorRed;
            }
        }

        private void UpdateBlocknumber(uint blocknumber)
        {
            _lblBlockNumber.text = blocknumber.ToString();

            if (Network.Client.Account != null)
            {
                var fileName = Network.Wallet.FileName;
                if (Network.Wallet.FileName.Length > 12)
                {
                    fileName = $"{Network.Wallet.FileName.Substring(0, 10)}..";
                }
                _lblAccount.text = fileName;
                _lblAddress.text = Network.Client.Account.Value.Take(6) + " ... " + Network.Client.Account.Value.Skip(43);
            }
            else
            {
                _lblAccount.text = "...";
            }

            if (Storage.AccountInfo != null && Storage.AccountInfo.Data != null)
            {
                _lblToken.text = GameConstant.BalanceFormatter(BigInteger.Divide(Storage.AccountInfo.Data.Free, new BigInteger(SubstrateNetwork.DECIMALS))) + " HEXA";
            }
            else
            {
                _lblToken.text = ".";
            }
        }
    }
}