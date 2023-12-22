import { Fragment } from 'react';
import NavHeader from '@/components/layouts/nav-header';
import Footer from '@/components/layouts/footer';
import { RootLayoutProps } from '@/types';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: RootLayoutProps) {
  return (
    <Fragment>
      <NavHeader />
      {children}
      <Footer />
    </Fragment>
  );
}
