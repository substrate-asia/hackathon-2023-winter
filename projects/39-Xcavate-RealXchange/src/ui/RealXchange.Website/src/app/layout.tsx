import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { siteConfig } from '@/config/site';
import { RootLayoutProps } from '@/types';
import Script from 'next/script';
import '@/styles/globals.css';
import dynamic from 'next/dynamic';
// import SporranContextProvider from '@/context/sporran-context';

const SporranContextProvider = dynamic(() => import('@/context/sporran-context'), {
  ssr: false
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SporranContextProvider>{children}</SporranContextProvider>
        <Script src="/kilt-script.js" strategy="lazyOnload"></Script>
      </body>
    </html>
  );
}
