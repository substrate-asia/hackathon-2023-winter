using Assets.Scripts;
using System.Threading;
using UnityEngine;

public class StorageManager : Singleton<StorageManager>
{
    public delegate void NextBlocknumberHandler(uint blocknumber);

    public event NextBlocknumberHandler OnNextBlocknumber;

    public NetworkManager Network => NetworkManager.GetInstance();

    public uint BlockNumber { get; private set; }

    /// <summary>
    /// Awake is called when the script instance is being loaded
    /// </summary>
    protected override void Awake()
    {
        base.Awake();
        //Your code goes here
    }

    /// <summary>
    /// Start is called before the first frame update
    /// </summary>
    private void Start()
    {
        //InvokeRepeating(nameof(UpdatedBaseData), 4.0f, 10.0f);
        //InvokeRepeating(nameof(UpdatedMarket), 5.0f, 60.0f);
    }

    /// <summary>
    /// Update is called once per frame
    /// </summary>
    private void Update()
    {
    }

    internal void StartPolling()
    {
        InvokeRepeating(nameof(UpdatedBaseData), 0.0f, 2.0f);
        InvokeRepeating(nameof(UpdatedMarket), 5.0f, 20.0f);
    }

    public bool CanPollStorage()
    {
        //if (Network.Client == null)
        //{
        //    Debug.LogError($"[StorageManager] Client is null");
        //    return false;
        //}

        //if (!Network.Client.IsConnected)
        //{
        //    Debug.Log($"[StorageManager] Client is not connected");
        //    return false;
        //}

        //if (Network.Client.Account == null)
        //{
        //    Debug.Log($"[StorageManager] Client account not set");
        //    return false;
        //}

        return true;
    }

    private async void UpdatedBaseData()
    {
        if (!CanPollStorage())
        {
            return;
        }

        //var blockNumber = await Network.Client.GetBlocknumberAsync(CancellationToken.None);

        //if (blockNumber == null || BlockNumber >= blockNumber)
        //{
        //    return;
        //}

        //BlockNumber = blockNumber.Value;
        //OnNextBlocknumber?.Invoke(blockNumber.Value);

        //Debug.Log($"[StorageManager] Block {BlockNumber}");
    }

    private async void UpdatedMarket()
    {
        if (!CanPollStorage())
        {
            return;
        }

    }
}