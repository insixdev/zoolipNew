import React from "react";
import { useHref, useLinkClickHandler } from "react-router";

type ButtonLinkProps = {
  children: React.ReactNode;
  to: string;
  variant?: "primary" | "secondary" | "danger" | "especial";
  size?: "sm" | "md" | "lg" | "xl";
  classNameProps?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function ButtonLink({
  children,
  to,
  classNameProps = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to);
  
  const base = "border-transparent rounded-xl font-semibold px-4 py-2 inline-block text-center cursor-pointer transition-colors duration-200";
  
  const variants = {
    primary: "bg-white/10 text-white border border-transparent hover:bg-brand hover:border-orange-200 hover:bg-white/20",
    especial: "bg-brand-especial text-black hover:bg-white",
    secondary: "bg-black/20 text-white border border-transparent hover:border-violet-500 hover:bg-black/30 transition-all",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  
  const sizes = {
    sm: "text-sm px-2 py-1",
    md: "text-base",
    lg: "text-lg px-6 py-3",
    xl: "text-xl px-10 py-5",
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${classNameProps} `.trim()}
      {...props}
    >
      {children}
    </a>
  );
}
