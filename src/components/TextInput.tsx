import type { InputHTMLAttributes } from "react";

export default function TextInput({
  type = "text",
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  type?: string
  className?: string;
}) {
  return (
    <input
      {...props}
      type={type}
      className={`border-gray-300 focus:outline-offset-0 focus:outline-blue-500 px-4 py-3 rounded-md bg-white ${className}`}
    />
  );
}
