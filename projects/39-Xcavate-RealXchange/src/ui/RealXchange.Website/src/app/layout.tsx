import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { siteConfig } from '@/config/site';
import { RootLayoutProps } from '@/types';
import Script from 'next/script';
import '@/styles/globals.css';
import SporranContextProvider from '@/context/sporran-context';

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
      <SporranContextProvider>
        <body className="min-h-screen antialiased">
          {children}
          <Script src="/kilt-script.js" strategy="lazyOnload"></Script>
        </body>
      </SporranContextProvider>
    </html>
  );
}
