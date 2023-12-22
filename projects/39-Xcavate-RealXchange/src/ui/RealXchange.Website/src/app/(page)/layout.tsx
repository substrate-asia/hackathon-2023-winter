import { Fragment } from 'react';
import NavHeader from '@/components/layouts/nav-header';
import Footer from '@/components/layouts/footer';
import { RootLayoutProps } from '@/types';

export default function PageLayout({ children }: RootLayoutProps) {
  return (
    <Fragment>
      <NavHeader />
      {children}
      <Footer />
    </Fragment>
  );
}
