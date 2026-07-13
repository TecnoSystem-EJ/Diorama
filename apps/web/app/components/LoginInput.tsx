import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const LoginInput = forwardRef<HTMLInputElement, Props>(({ error, className = "", ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <input
      ref={ref}
      className={`
        w-full bg-transparent border-b pb-2 text-base font-medium text-[#111111]
        placeholder:text-black/30 outline-none transition-colors duration-200
        ${error
          ? "border-red-400 focus:border-red-500"
          : "border-black/20 focus:border-[#1A365D]"
        }
        ${className}
      `}
      {...props}
    />
    {error && <span className="text-[11px] text-red-500 mt-0.5">{error}</span>}
  </div>
));

LoginInput.displayName = "LoginInput";
export { LoginInput };