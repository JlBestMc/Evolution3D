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
}
