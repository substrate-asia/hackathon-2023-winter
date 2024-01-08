import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

function SectionHeader({
  className,
  children,
  as: Comp = 'section',
  ...props
}: PageHeaderProps) {
  return (
    <Comp className={cn('grid gap-1', className)} {...props}>
      {children}
    </Comp>
  );
}

const headingVariants = cva('font-bold', {
  variants: {
    size: {
      default: 'text-[1.5rem]',
      md: 'text-[1rem]/[1.5rem]',
      lg: 'text-[2.625rem]'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

interface SectionTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

function SectionTitle({ className, size, as: Comp = 'h1', ...props }: SectionTitleProps) {
  return <Comp className={cn(headingVariants({ size, className }))} {...props} />;
}

const descriptionVariants = cva('text-muted-foreground max-w-[750px]', {
  variants: {
    size: {
      default: 'text-[ 0.75rem]/[1.5rem] font-light text-[0.8]'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

interface SectionDescriptionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof descriptionVariants> {
  as?: 'p' | 'span' | 'pre';
}

function SectionDescription({
  className,
  size,
  as: Comp = 'p',
  ...props
}: SectionDescriptionProps) {
  return <Comp className={cn(descriptionVariants({ size, className }))} {...props} />;
}

export { SectionHeader, SectionTitle, SectionDescription };
