"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-sm",
            "transition-all duration-200 outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:line-clamp-1",
            className
        )}
        style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
        }}
        onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
        }}
        onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        }}
        onFocus={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px var(--accent-dim)";
        }}
        onBlur={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-40" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn("flex cursor-default items-center justify-center py-1", className)}
        {...props}
    >
        <ChevronUp className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
    </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn("flex cursor-default items-center justify-center py-1", className)}
        {...props}
    >
        <ChevronDown className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
    </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
                position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className
            )}
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card), 0 0 24px rgba(0,0,0,0.5)",
            }}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
                className={cn(
                    "p-1.5",
                    position === "popper" &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn("px-3 py-1.5 text-xs font-semibold uppercase tracking-wider", className)}
        style={{ color: "var(--text-muted)" }}
        {...props}
    />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-sm outline-none",
            "transition-colors duration-150",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
            "data-[highlighted]:text-[var(--accent)]",
            className
        )}
        style={{ color: "var(--text-secondary)" }}
        onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--accent-subtle)";
            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
        }}
        onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        }}
        {...props}
    >
        <span className="absolute right-2.5 flex h-4 w-4 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px", className)}
        style={{ background: "var(--border)" }}
        {...props}
    />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
};
