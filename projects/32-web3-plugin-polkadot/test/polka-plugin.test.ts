import { InvalidResponseError, Web3 } from 'web3';
import { PolkaPlugin } from '../src';

describe('PolkaPlugin Tests', () => {
  it('should be able to register the plugin', () => {
    const web3 = new Web3('http://some-domain.com');
    expect(web3.polka).toBeUndefined();
    web3.registerPlugin(new PolkaPlugin());
    expect(web3.polka).toBeDefined();
  });

  describe('PolkaPlugin Provider exceptions', () => {
    let web3: Web3;

    beforeAll(async () => {
      web3 = new Web3('ws://127.0.0.1:9944/');
      web3.registerPlugin(new PolkaPlugin());
      web3.provider?.on('error', (error: any) => {
        console.log('Caught provider error: ', error.message || error);
      });
    });

    afterAll(() => {
      try {
        // only needed with ws and wss.
        // if the provider was http, an error will be thrown, ignore it
        web3.provider?.disconnect();
      } catch {
        // do nothing
      }
    });

    it('should throw `InvalidResponseError` when the method is not supported by the provider (simulated)', async () => {
      // simulate calling a method that is not supported by the provider
      web3.polka.substrate.chain.getBlock = () =>
        web3.requestManager.send({
          method: `unsupported_method_by the provider`,
        });

      try {
        await web3.polka.substrate.chain.getBlock();
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidResponseError);
        expect((error as InvalidResponseError).message).toBe('Returned error: Method not found');
      }
    });

    it('should throw `InvalidResponseError` when the method is not supported by the provider (calling polkadot method at substrate node)', async () => {
      try {
        // the connected provider is a substrate node and does not support this polkadot method
        await web3.polka.polkadot.beefy.getFinalizedHead();
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidResponseError);
        expect((error as InvalidResponseError).message).toBe('Returned error: Method not found');
      }
    });
  });
});
