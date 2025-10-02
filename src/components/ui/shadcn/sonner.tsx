import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ComponentProps, CSSProperties } from "react";

type Props = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: Props) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as Props["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
