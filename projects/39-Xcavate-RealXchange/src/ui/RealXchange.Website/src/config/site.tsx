import { Icons } from '@/components/icons';
import { NavItem } from '@/types';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'RealXchange',
  description:
    'Re-defining environmental, ecological and social project funding through an interactive NFT marketplace. ',
  mainNav: [
    {
      title: 'MARKETPLACE',
      href: '/marketplace'
    },
    {
      title: 'HOW IT WORKS',
      href: '#how-it-works'
    },
    {
      title: 'Bond',
      href: '/bond'
    }
  ] satisfies NavItem[],
  profileNav: [
    {
      title: 'Create project',
      href: '/create',
      icon: <Icons.profile className="h-6 w-6 fill-foreground" />
    },
    {
      title: 'My Profile',
      href: '/profile',
      icon: <Icons.profile className="h-6 w-6 fill-foreground" />
    },
    {
      title: 'Settings',
      href: '/create',
      icon: <Icons.profile className="h-6 w-6 fill-foreground" />
    },
    {
      title: 'Help',
      href: '/create',
      icon: <Icons.profile className="h-6 w-6 fill-foreground" />
    }
  ]
};
