import { useSporranContext } from '@/context/sporran-context';
import { exceptionToError } from '@/lib/exceptionToError';
import { shortenAddress } from '@/lib/utils';
import { useCallback, useState } from 'react';

type FlowError = 'closed' | 'unauthorized' | 'unknown';

export default function ConnectKiltButton() {
  const { kilt } = useSporranContext();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<FlowError>();
  const [user, setUser] = useState();

  const handleConnect = useCallback(async (extension: any) => {
    try {
      setProcessing(true);
      setError(undefined);

      if (extension) {
        const didList = await extension.getDidList();
        if (didList.length > 0) {
          const did = didList[0].did || '';
          setUser(did);
        }
      }
    } catch (exception) {
      const { message } = exceptionToError(exception);
      if (message.includes('closed')) {
        setError('closed');
      } else if (message.includes('Not authorized')) {
        setError('unauthorized');
      } else {
        setError('unknown');
        console.error(exception);
      }
      setProcessing(false);
    }
  }, []);

  console.log(user);

  return (
    <button
      className="flex items-center gap-2.5 rounded-3xl bg-primary px-4 py-2 text-[0.875rem]/[1.25rem] text-primary-light duration-700 hover:bg-primary/90"
      onClick={() => handleConnect(kilt.sporran)}
    >
      {!user ? 'Connect wallet' : shortenAddress(user)}
    </button>
  );
}
