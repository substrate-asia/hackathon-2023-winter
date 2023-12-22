'use client';

import { initializeKiltExtensionAPI } from '@kiltprotocol/kilt-extension-api';
import { createContext, useContext } from 'react';

if (typeof window !== 'undefined') {
  initializeKiltExtensionAPI();
}
let { kilt } = typeof window !== 'undefined' ? window : {};

const SporranContext = createContext<any | null>(null);

export function useSporranContext() {
  return useContext(SporranContext);
}

export interface PageProps {
  children?: React.ReactNode;
}

// kilt = { meta: { value: { versions: { credentials: '3.0' } } } };

export default function SporranContextProvider({ children }: PageProps) {
  return <SporranContext.Provider value={{ kilt }}>{children}</SporranContext.Provider>;
}

// {kilt: meta: {
//   value: {
//       versions: {
//           credentials: '3.0'
//       }
//   }}
