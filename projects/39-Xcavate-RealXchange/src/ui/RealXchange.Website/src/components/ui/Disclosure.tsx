'use client';

// import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import { useCallback, useId, useMemo, useState } from 'react';
import { Icons } from '../icons';

interface DisclosureProp {
  title: string;
  collapseOpen?: boolean;
  /** set element-type for a custom-tag */
  as?: React.ElementType;
  children: React.ReactNode;
}

export const Disclosure = ({
  title,
  collapseOpen = false,
  as = 'div',
  children
}: DisclosureProp) => {
  const [isOpen, setIsOpen] = useState(collapseOpen);

  // Create a new Tag with a selected type
  const PanelRoot: React.ElementType = as;

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const disclosure = useMemo(() => {
    return { toggle };
  }, [toggle]);

  // assebilty attributes
  const a11yAttributes = {
    id: `realxc-disclosure-button-${title}`,
    'aria-label': 'realxc-disclosure-button',
    'aria-controls': `realxc-disclosure-panel-${title}`,
    'aria-expanded': collapseOpen,
    'aria-labelledby': `realxc-disclosure-button-${title}`
  };

  return (
    <div className="flex w-[470px] flex-col items-end gap-6 rounded-lg border border-foreground/[0.42] bg-background px-4  pt-4 shadow-disclosure">
      <button
        // {...a11yAttributes}
        className="flex w-full items-center justify-between px-2 py-3"
        onClick={disclosure.toggle}
      >
        <h3 className="text-[1rem]/[1.5rem]">{title}</h3>
        {isOpen ? (
          <Icons.ArrowUp className="h-6 w-6 fill-primary p-1" />
        ) : (
          <Icons.ArrowDown className="h-6 w-6 fill-primary p-1" />
        )}
      </button>

      {isOpen ? (
        <PanelRoot className="flex h-full w-full flex-col gap-6 pb-6">
          {children}
        </PanelRoot>
      ) : null}
    </div>
  );
};
