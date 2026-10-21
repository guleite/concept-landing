import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// Botões em pílula (rounded-lg = 24px do Design System), como no site original.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-clip-padding font-sans font-medium whitespace-nowrap transition-[color,background-color,border-color] duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-accent-blue hover:text-surface",
        outline:
          "border-line-strong bg-transparent text-foreground hover:border-accent-blue hover:bg-accent-soft hover:text-accent-text aria-expanded:bg-accent-soft",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent-soft",
        ghost: "hover:bg-accent-soft hover:text-accent-text aria-expanded:bg-accent-soft",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-9 px-4 text-[0.8125rem]",
        lg: "h-12 px-6 text-[0.9375rem]",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
