import React from "react"
type ButtonProps = {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger" | "especial"
  size?: "sm" | "md" | "lg" | "xl"
  handleClick?: () => void;
  classNameProps?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, handleClick,classNameProps = "",variant = "primary", size = "md", ...props }: ButtonProps) {
  const base = "border-transparent rounded-xl font-semibold px-4 py-2 inline-block text-center cursor-pointer transition-colors duration-200";
  const variants = {
    primary: "bg-transparent text-white border border-transparent hover:bg-red-500",
    especial: "bg-brand-especial text-black border border-transparent",
    secondary: "bg-transparent text-white border border-transparent hover:bg-brand hover:border-orange-200",
    danger: "bg-red-600 text-white border border-transparent hover:bg-red-700",
  } 
  const sizes = {
    sm: "text-sm px-2 py-1",
    md: "text-base",
    lg: "text-lg px-6 py-3",
    xl: "text-xl px-10 py-5"
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${classNameProps} mr-3 top-0 `} {...props} onClick={handleClick}>
      {children}
    </button>
  )
}
