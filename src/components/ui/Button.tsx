"use client";
import { ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = {
    children: ReactNode;
    variant?: "primary" | "secondary";
    size?: "sm" | "md";
    icon?: ReactNode;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    variant = "primary",
    size = "md",
    icon,
    className,
    ...props
}: ButtonProps) {
    return (
        <button
        {...props}
        className={classNames(
            "select-none rounded-full font-semibold outline-none focus-visible:ring-2 ring-slate-300 ring-offset-2 duration-200 disabled:opacity-50 flex items-center justify-center",
            {
            "px-3.5 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-base": size === "md",

            "bg-slate-900 text-white hover:bg-slate-700": variant === "primary",
            "bg-white border border-slate-200 hover:bg-slate-100 text-slate-900":
                variant === "secondary",
            },
            className
        )}
        >
        {icon && <span className="mr-2 flex items-center text-lg">{icon}</span>}
        {children}
        </button>
    );
}