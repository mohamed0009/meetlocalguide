import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
    {
        variants: {
            variant: {
                default: "glow-btn text-white",
                secondary:
                    "text-[var(--text-primary)] hover:border-[var(--border-accent)] hover:text-[var(--accent)]",
                outline:
                    "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]",
                ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]",
                danger: "bg-red-900/30 text-red-400 border border-red-500/30 hover:bg-red-900/50 hover:text-red-300",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-xl px-7 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
