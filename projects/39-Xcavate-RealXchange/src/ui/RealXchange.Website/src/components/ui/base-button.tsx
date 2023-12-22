import { ComponentProps } from 'react';
import Link from 'next/link';

type ButtonType = ComponentProps<'button'> & ComponentProps<'a'>;

export interface BaseButtonProps extends ButtonType {}

/**
 * This is a base component that will render either a button or a link,
 * depending on the props that are passed to it.
 */
export function BaseButton({ href, ...props }: BaseButtonProps) {
  const isLink = typeof href !== 'undefined';

  const ButtonType = isLink ? 'a' : 'button';
  const content = <ButtonType {...props} />;

  if (isLink) {
    return (
      <Link href={href} legacyBehavior passHref>
        {content}
      </Link>
    );
  }

  return content;
}

BaseButton.displayName = 'BaseButton';
