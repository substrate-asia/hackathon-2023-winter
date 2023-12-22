import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const shellVariants = cva('', {
  variants: {
    variant: {
      default: 'container grid items-center gap-8 pb-8 pt-6 md:px-[100px] md:py-[46px]',
      divided:
        'flex flex-col gap-[124px] border-b border-foreground/[0.42] px-[100px] md:flex-row',
      centered: 'container flex h-[100dvh] max-w-2xl flex-col justify-center'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({ className, as: Comp = 'main', variant, ...props }: ShellProps) {
  return <Comp className={cn(shellVariants({ variant }), className)} {...props} />;
}

export { Shell, shellVariants };
