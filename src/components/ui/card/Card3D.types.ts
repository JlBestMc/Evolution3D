import type { Animal } from "../../../data/animals";

export interface Card3DProps {
  animal: Animal;
  enableZoom?: boolean;
  minDistance?: number;
  maxDistance?: number;
  widthClass?: string; 
  heightClass?: string; 
  className?: string;
  modelScale?: number; 
  // Memory/perf controls
  lazyMount3D?: boolean; // mount Canvas only when in viewport (default true)
  rootMargin?: string;   // IntersectionObserver margin (default "300px")
  clearOnUnmount?: boolean; // clear useGLTF cache on unmount (default true)
}
