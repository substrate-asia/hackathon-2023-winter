using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using UnityEngine;
using UnityEngine.UIElements;

namespace Assets.Scripts.ScreenStates
{
    public class MainScreenState : ScreenBaseState
    {
        private Label _lblAccountName;
        private Label _lblAccountBalance;
        private Label _lblAccountFreemints;
        private Label _lblBlocknumber;
        private Label _lblBalance;
        private Label _lblFreemints;

        private Label _lblExtrinsicCount;
        private Label _lblExtrinsicInfo;

        private VisualElement _velCloseTab;
        private VisualElement _velPrimaryTab;
        private VisualElement _velSecondaryTab;
        private VisualElement _velForgeState1;
        private VisualElement _velForgeState2;
        private VisualElement _velMintTabBox;

        private VisualElement _velExtrinsicBox;
        
        private VisualElement[] _velAnimCols;
        private VisualElement[] _velExtrinsicStatusArray;
        private VisualElement[] _velClockPosL;
        private Label[] _lblClockPosL;
        private VisualElement[] _velClockPosR;
        private Label[] _lblClockPosR;
        private List<VisualElement[]> _velClockCols;

        private VisualElement _bottomBound;

        private int _subscriptionIndex;
        private List<string> _subscriptionOrder;
        //private Dictionary<string, ExtrinsicInfo> _subscriptionDict;

        public MainScreenState(FlowController _flowController)
            : base(_flowController) { }

        public override void EnterState()
        {
            Debug.Log($"[{this.GetType().Name}] EnterState");

            Storage.StartPolling();

            _subscriptionIndex = 0;
            _subscriptionOrder = new List<string>();
            //_subscriptionDict = new Dictionary<string, ExtrinsicInfo>();

            // filler is to avoid camera in the ui
            var topFiller = FlowController.VelContainer.Q<VisualElement>("VelTopFiller");
            topFiller.style.backgroundColor = GameConstant.ColorDark;

            var visualTreeAsset = Resources.Load<VisualTreeAsset>($"UI/Screens/MainScreenUI");
            var instance = visualTreeAsset.Instantiate();
            instance.style.width = new Length(100, LengthUnit.Percent);
            instance.style.height = new Length(98, LengthUnit.Percent);

            var topBound = instance.Q<VisualElement>("TopBound");

            // updated tab wallet
            _lblAccountName = topBound.Q<Label>("LblAccountName");
            _lblAccountName.text = Network.Wallet.FileName;
            _lblAccountBalance = topBound.Q<Label>("LblAccountBalance");
            _lblAccountBalance.text = "...";
            _lblAccountFreemints = topBound.Q<Label>("LblAccountFreemints");
            _lblAccountFreemints.text = "...";

            // updated clock
            _velClockPosL = topBound.Q<VisualElement>("VelPositionLeft").Children().ToArray();
            _lblClockPosL = _velClockPosL.Select(p => p.Children().First() as Label).ToArray();
            _velClockPosR = topBound.Q<VisualElement>("VelPositionRight").Children().ToArray();
            _lblClockPosR = _velClockPosR.Select(p => p.Children().First() as Label).ToArray();

            _velAnimCols = new VisualElement[]
            {
                topBound.Q<VisualElement>("VelCol1"),
                topBound.Q<VisualElement>("VelCol2"),
                topBound.Q<VisualElement>("VelCol3"),
                topBound.Q<VisualElement>("VelCol4")
            };
            _velClockCols = new List<VisualElement[]> {
                _velAnimCols[0].Children().ToArray(),
                _velAnimCols[1].Children().ToArray(),
                _velAnimCols[2].Children().ToArray(),
                _velAnimCols[3].Children().ToArray()
            };

            foreach(var vel in _velAnimCols)
            {
                vel.style.transitionProperty = new List<StylePropertyName>() { "translate" };
                vel.style.transitionTimingFunction = new List<EasingFunction> { EasingMode.EaseInOutCubic };
            }

            // updated tab block
            _lblBlocknumber = topBound.Q<Label>("LblBlocknumber");
            _lblBlocknumber.text = "...";


            _velExtrinsicBox = topBound.Q<VisualElement>("VelExtrinsicBox");
            _velExtrinsicBox.style.display = DisplayStyle.None;
            _lblExtrinsicCount = topBound.Q<Label>("LblExtrinsicCount");
            _lblExtrinsicInfo = topBound.Q<Label>("LblExtrinsicInfo");
            _velExtrinsicStatusArray = new VisualElement[]
            {
                topBound.Q<VisualElement>("VelExtrinsicStatus1"),
                topBound.Q<VisualElement>("VelExtrinsicStatus2"),
                topBound.Q<VisualElement>("VelExtrinsicStatus3")
            };

            _bottomBound = instance.Q<VisualElement>("BottomBound");

            var velDashBoard = _bottomBound.Q<VisualElement>("VelDashBoard");
            var velInventory = _bottomBound.Q<VisualElement>("VelInventory");
            var velMarket = _bottomBound.Q<VisualElement>("VelMarket");
            var velRanking = _bottomBound.Q<VisualElement>("VelRanking");



            // add container
            FlowController.VelContainer.Add(instance);

            Network.ConnectionStateChanged += OnConnectionStateChanged;
            //Storage.OnNextBlocknumber += UpdateBlocknumber;
            //Network.Client.ExtrinsicManager.ExtrinsicUpdated += OnExtrinsicUpdated;
            Network.ExtrinsicCheck += OnExtrinsicCheck;

            FlowController.ChangeScreenSubState(ScreenState.MainScreen, ScreenSubState.Dashboard);
        }

        public override void ExitState()
        {
            Debug.Log($"[{this.GetType().Name}] ExitState");

            _subscriptionOrder.Clear();

            Network.ConnectionStateChanged -= OnConnectionStateChanged;
            //Storage.OnNextBlocknumber -= UpdateBlocknumber;
            //Network.Client.ExtrinsicManager.ExtrinsicUpdated -= OnExtrinsicUpdated;
            Network.ExtrinsicCheck -= OnExtrinsicCheck;
        }

        private void OnConnectionStateChanged(bool IsConnected)
        {
            if (!IsConnected)
            {
                FlowController.ChangeScreenState(ScreenState.LoadScreen);
            }
        }

        public void DisplayBottomMenu(bool show)
        {
            _bottomBound.style.display = show ? DisplayStyle.Flex : DisplayStyle.None;
        }

        private void OnExtrinsicCheck()
        {
            //if (_subscriptionOrder.Count == 0)
            //{
            //    _velExtrinsicBox.style.backgroundColor = GameConstant.ColorExtrinsic;
            //    _velExtrinsicBox.style.display = DisplayStyle.None;
            //}

            //if (!Network.Client.IsConnected)
            //{
            //    _subscriptionOrder.Clear();
            //    _subscriptionDict.Clear();

            //    // cleaning up
            //    _velExtrinsicBox.style.backgroundColor = GameConstant.ColorExtrinsicFailedDark;
            //    _lblExtrinsicInfo.text = "lost connection...";
            //}
        }

        //private void OnExtrinsicUpdated(string subscriptionId, ExtrinsicInfo extrinsicInfo)
        //{
        //    Debug.Log($"[{GetType().Name}] OnExtrinsicUpdated {subscriptionId} {extrinsicInfo.TransactionEvent}");

        //    if (!_subscriptionDict.ContainsKey(subscriptionId))
        //    {
        //        _subscriptionOrder.Add(subscriptionId);
        //        _subscriptionDict.Add(subscriptionId, extrinsicInfo);
        //    }
        //    else
        //    {
        //        _subscriptionDict[subscriptionId] = extrinsicInfo;
        //    }

        //    var infoStr = "Unknown";
        //    if (extrinsicInfo.ExtrinsicType != null)
        //    {
        //        infoStr = extrinsicInfo.ExtrinsicType.Contains(".") ? extrinsicInfo.ExtrinsicType.Split(".")[1] : extrinsicInfo.ExtrinsicType;
        //    }

        //    if (extrinsicInfo.IsCompleted)
        //    {
        //        if (_subscriptionIndex == _subscriptionOrder.IndexOf(subscriptionId))
        //        {
        //            _subscriptionIndex = 0;
        //        }
        //        _subscriptionDict.Remove(subscriptionId);
        //        _subscriptionOrder.Remove(subscriptionId);
        //    }
        //}

        //private void UpdateBlocknumber(uint blocknumber)
        //{
        //    _lblBlocknumber.text = blocknumber.ToString();

        //    if (Network.Client.Account != null)
        //    {
        //        var fileName = Network.Wallet.FileName;
        //        if (Network.Wallet.FileName.Length > 12)
        //        {
        //            fileName = $"{Network.Wallet.FileName.Substring(0, 10)}..";
        //        }
        //        _lblAccountName.text = fileName;
        //    }
        //    else
        //    {
        //        _lblAccountName.text = "...";
        //    }

        //}

    }
}