export interface Animal {
  name: string;
  description: string;
  model: string;
  startMa?: number; // millones de años atrás (para orden cronológico)
  eraId?: string; // opcional: vincular a una era
  thumb?: string; // miniatura opcional
  // Opcional: soporte para embeds de Sketchfab en EraPage
  sketchfabUid?: string;
  sketchfabUrl?: string;
}

const animals: Animal[] = [
  {
    name: "Pakicetus",
    description: "An early whale that lived in the Eocene epoch",
    model: "/models/Pakicetus3D.glb",
    startMa: 50,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Archaeopteryx",
    description: "The first bird",
    model: "/models/Archaeopteryx3D.glb",
    startMa: 150,
    eraId: "mesozoic",
    thumb: "/images/mesozoic.png",
  },
  {
    name: "Whale",
    description: "The largest mammal in the world",
    model: "/models/Whale3D.glb",
    startMa: 30,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "tyrannosaurus rex",
    description: "One of the largest land carnivores of all time",
    model: "/models/tyranosaurus3D.glb",
  },
  {
    name: "Chicken",
    description: "Domestic chicken (with foldered textures)",
    model: "/models/chicken/source/Chicken.glb",
    startMa: 0.01,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
];

export default animals;
