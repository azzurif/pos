import type { ButtonHTMLAttributes } from "react";

export default function PrimaryButton({
  type = "submit",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  type?: string
  className?: string;
}) {
  return (
    <button
      type={type}
      className={`text-white bg-blue-500 hover:bg-blue-600 font-semibold rounded-lg px-5 py-2.5 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
