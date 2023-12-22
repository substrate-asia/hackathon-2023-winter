// ethereum.d.ts
interface Ethereum {
    enable(): Promise<string[]>;
    on(event: string, listener: (...args: any[]) => void): void;
    send(method: string, params?: any[]): Promise<void>;
}

interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request?: (...args: any[]) => Promise<void>;
    };
  }