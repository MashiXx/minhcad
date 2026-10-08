import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_1px_0_rgb(255_255_255/0.18)_inset,0_6px_18px_-8px_rgb(47_123_255/0.6)] hover:bg-accent-hover hover:shadow-[0_1px_0_rgb(255_255_255/0.2)_inset,0_12px_28px_-10px_rgb(47_123_255/0.75)]",
  secondary:
    "border border-line-strong bg-white/[0.03] text-fg hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_10px_24px_-14px_rgb(0_0_0/0.9)]",
  ghost: "text-muted hover:text-fg hover:bg-white/[0.04]",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-2 rounded-md",
  md: "h-11 px-5 text-sm gap-2.5 rounded-[9px]",
  lg: "h-12 px-6 text-[15px] gap-3 rounded-[10px]",
};

export const buttonBase =
  "group/btn relative inline-flex select-none items-center justify-center font-medium tracking-[-0.005em] whitespace-nowrap transition-[transform,background-color,box-shadow,border-color,color] duration-200 ease-[var(--ease-out-expo)] hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(buttonBase, variantClass[variant], sizeClass[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Leading icon, e.g. a platform logo. */
  icon?: ReactNode;
  /** Trailing icon that shifts on hover (arrow, download). */
  trailingIcon?: ReactNode;
  children: ReactNode;
  className?: string;
};

function Content({ icon, trailingIcon, children }: Pick<CommonProps, "icon" | "trailingIcon" | "children">) {
  return (
    <>
      {icon ? <span className="-ml-0.5 flex shrink-0 items-center">{icon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? (
        <span className="-mr-1 flex shrink-0 items-center transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-[3px]">
          {trailingIcon}
        </span>
      ) : null}
    </>
  );
}

type LinkButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & { href: string };

/** A link styled as a button. Use for navigation. */
export function LinkButton({ variant, size, icon, trailingIcon, children, className, ...rest }: LinkButtonProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      <Content icon={icon} trailingIcon={trailingIcon}>
        {children}
      </Content>
    </Link>
  );
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

/** A real <button>. Use for actions. */
export function Button({ variant, size, icon, trailingIcon, children, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      <Content icon={icon} trailingIcon={trailingIcon}>
        {children}
      </Content>
    </button>
  );
}
