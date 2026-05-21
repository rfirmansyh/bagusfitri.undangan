import * as React from 'react';

import { cn } from '@/src/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const buttonVariants = cva(
  'rounded-[4px] font-normal flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-[#616245] text-primary-foreground hover:bg-[#616245]/80 text-white',
        '2F4539': 'bg-[#2F4539] text-primary-foreground hover:bg-[#2F4539]/80 text-white',
        outline: 'bg-transparent text-[#2F4539] border border-[#2F4539]',
      },
      size: {
        default: 'text-sm h-8 py-2 px-[1.2rem]',
        lg: 'text-[14px] py-2 px-4',
        sm: 'text-[.6rem] py-[.4rem] px-[.9rem]',
        xs: 'text-[.5rem] py-[.3rem] px-[.7rem]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
