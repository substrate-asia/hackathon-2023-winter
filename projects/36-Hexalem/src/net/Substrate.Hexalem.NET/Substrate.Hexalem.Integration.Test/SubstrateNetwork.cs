using Schnorrkel.Keys;
using Substrate.Integration;
using Substrate.Integration.Client;
using Substrate.Integration.Helper;
using Substrate.NetApi;
using Substrate.NetApi.Model.Types;
using Substrate.NetApi.Model.Types.Base;
using Substrate.NetApi.Model.Types.Primitive;

namespace Substrate.Hexalem.Integration.Test
{
    public class SubstrateNetworkTest
    {
        public MiniSecret MiniSecretAlice => new MiniSecret(Utils.HexToByteArray("0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a"), ExpandMode.Ed25519);
        public Account Alice => Account.Build(KeyType.Sr25519, MiniSecretAlice.ExpandToSecret().ToBytes(), MiniSecretAlice.GetPair().Public.Key);

        public MiniSecret MiniSecretBob => new MiniSecret(Utils.HexToByteArray("0x398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89"), ExpandMode.Ed25519);
        public Account Bob => Account.Build(KeyType.Sr25519, MiniSecretBob.ExpandToSecret().ToBytes(), MiniSecretBob.GetPair().Public.Key);

        private readonly string _nodeUrl = "ws://127.0.0.1:9944";

        private SubstrateNetwork _client;

        [SetUp]
        public void Setup()
        {
            // create client
            _client = new SubstrateNetwork(Alice, Substrate.Integration.Helper.NetworkType.Live, _nodeUrl);
        }

        [TearDown]
        public void TearDown()
        {
            // dispose client
            _client.SubstrateClient.Dispose();
        }

        [Test]
        public async Task ConnectionTestAsync()
        {
            Assert.That(_client, Is.Not.Null);
            Assert.That(_client.IsConnected, Is.False);

            Assert.That(await _client.ConnectAsync(true, true, CancellationToken.None), Is.True);
            Assert.That(_client.IsConnected, Is.True);

            Assert.That(await _client.DisconnectAsync(), Is.True);
            Assert.That(_client.IsConnected, Is.False);
        }


        [Test]
        public async Task Extrinsic_EventTestAsync()
        {
            Assert.That(_client, Is.Not.Null);
            Assert.That(_client.IsConnected, Is.False);

            Assert.That(await _client.ConnectAsync(true, true, CancellationToken.None), Is.True);
            Assert.That(_client.IsConnected, Is.True);

            var tcs = new TaskCompletionSource<ExtrinsicInfo>();

            _client.ExtrinsicManager.ExtrinsicUpdated += (subscriptionId, queueInfo) =>
            {
                if (queueInfo.HasEvents)
                {
                    tcs.SetResult(queueInfo);
                }
            };

            var subscriptionId = await _client.TransferKeepAliveAsync(Bob.ToAccountId32(), 1000000000000000, 1, CancellationToken.None);
            if (subscriptionId == null)
            {
                Assert.Fail();
            }

            await Task.WhenAny(tcs.Task, Task.Delay(TimeSpan.FromMinutes(1)));

            Assert.That(tcs.Task.IsCompleted, Is.True);

            Assert.That(await _client.DisconnectAsync(), Is.True);
            Assert.That(_client.IsConnected, Is.False);
        }

    }
}
