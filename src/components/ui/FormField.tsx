"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const wrapperClass =
  "flex w-full gap-3 rounded-xl border border-fuchsia-400/25 bg-white/[0.06] px-3.5 transition-all focus-within:border-cyan-400/50 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]";

const fieldClass =
  "flex-1 min-w-0 w-full bg-transparent border-0 outline-none text-[#faf5ff] placeholder:text-violet-300/50 text-sm leading-normal";

function FieldIcon({ icon: Icon, multiline }: { icon: LucideIcon; multiline?: boolean }) {
  return (
    <Icon
      className={cn(
        "h-4 w-4 shrink-0 text-violet-300/80",
        multiline && "mt-1"
      )}
      strokeWidth={2}
      aria-hidden
    />
  );
}

export function FormInput({
  icon,
  className,
  ...rest
}: { icon: LucideIcon } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn(wrapperClass, "items-center py-2.5")}>
      <FieldIcon icon={icon} />
      <input {...rest} className={cn(fieldClass, className)} />
    </div>
  );
}

export function FormTextarea({
  icon,
  className,
  ...rest
}: { icon: LucideIcon } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cn(wrapperClass, "items-start py-3")}>
      <FieldIcon icon={icon} multiline />
      <textarea
        {...rest}
        className={cn(fieldClass, "min-h-[100px] resize-none py-0", className)}
      />
    </div>
  );
}
