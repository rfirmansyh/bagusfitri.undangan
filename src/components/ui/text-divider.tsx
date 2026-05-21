import type { ReactNode } from 'react';

import { cn } from '@/src/lib/utils';

type TextDividerProps = {
  color?: string;
  as?: keyof Pick<HTMLElementTagNameMap, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'>;
  children: ReactNode;
  className?: string;
};

const TextDivider = ({
  as: Component = 'span',
  children,
  color = '#333333',
  className,
}: TextDividerProps) => {
  const rootClass = cn('flex w-full grow items-center gap-[12px] mx-auto', className);
  const decClass = cn('grow h-px');

  return (
    <div className={rootClass}>
      <div className={decClass} style={{ backgroundColor: color }} />
      <Component className="shrink-0 whitespace-nowrap">{children}</Component>
      <div className={decClass} style={{ backgroundColor: color }} />
    </div>
  );
};

export default TextDivider;
