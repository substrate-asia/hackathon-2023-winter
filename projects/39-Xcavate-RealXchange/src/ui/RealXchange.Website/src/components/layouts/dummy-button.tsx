'use client';

import { useCallback, useEffect, useState } from 'react';
import { exceptionToError } from '@/lib/exceptionToError';
import { getExtensions } from '@kiltprotocol/kilt-extension-api';
import {
  InjectedWindowProvider,
  PubSubSessionV1,
  PubSubSessionV2
} from '@kiltprotocol/kilt-extension-api/types';
import { getSession } from '@/lib/session';
import { useSporranContext } from '@/context/sporran-context';

type FlowError = 'closed' | 'unauthorized' | 'unknown';

export default function DummyButton({ onConnect }: { onConnect: (s: any) => void }) {
  const { kilt } = useSporranContext();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<FlowError>();
  const [extensions, setExtensions] = useState<
    InjectedWindowProvider<PubSubSessionV1 | PubSubSessionV2>[]
  >([]);

  useEffect(() => {
    function handler() {
      setExtensions(getExtensions());
    }
    handler();
  }, []);

  const handleConnect = useCallback(
    async (extension: any) => {
      try {
        setProcessing(true);
        setError(undefined);

        const sporranSession = await getSession(extension);
        onConnect(sporranSession);
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
    },
    [onConnect]
  );

  let extension = extensions.find(ext => ext);

  return (
    <button
      className="flex items-center gap-2.5 rounded-3xl bg-primary px-4 py-2 text-[0.875rem]/[1.25rem] text-primary-light duration-700 hover:bg-primary/90"
      onClick={() => handleConnect(kilt.sporran)}
    >
      Connect wallet
    </button>
  );
}
