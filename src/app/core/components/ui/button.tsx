import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/core/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 active:scale-95 active:shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg active:scale-95",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md hover:border-gray-400 active:scale-95",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md active:scale-95",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 text-gray-700 active:bg-gray-200",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 active:text-blue-800",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

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
