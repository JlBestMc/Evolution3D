import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: DivProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: DivProps) {
  return (
    <div
      className={`p-4 md:p-5 border-b border-white/5 ${className}`}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }: DivProps) {
  return (
    <h3
      className={`text-base md:text-lg font-semibold tracking-tight text-white ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }: DivProps) {
  return (
    <p
      className={`text-xs md:text-sm text-white/70 leading-snug ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={`p-4 md:p-5 ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }: DivProps) {
  return (
    <div
      className={`p-4 md:p-5 border-t border-white/5 ${className}`}
      {...props}
    />
  );
}

export default Card;
