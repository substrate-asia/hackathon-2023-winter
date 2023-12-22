'use client';

import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MainNav() {
  const pathname = usePathname();

  return (
    <ul className=" flex items-center justify-center gap-6">
      {siteConfig.mainNav.map(nav => (
        <li key={nav.href}>
          <Link
            href={nav.href}
            className={cn(
              pathname === nav.href ? 'text-primary' : 'text-foreground duration-500',
              'text-[1rem]/[0.014rem] font-light uppercase hover:text-primary/75'
            )}
          >
            {nav.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
