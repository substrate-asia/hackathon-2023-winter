import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-foreground/70', className)}
      {...props}
    />
  );
}

export { Skeleton };

// const SporranContextProvider = dynamic(() => import('@/context/sporran-context'), {
//     ssr: false
//   });
