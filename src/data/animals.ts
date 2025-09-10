export interface Animal {
  name: string;
  description: string;
  model: string;
  startMa?: number; // millones de años atrás (para orden cronológico)
  eraId?: string; // opcional: vincular a una era
  thumb?: string; // miniatura opcional
}

const animals: Animal[] = [
  {
    name: "Pakicetus",
    description: "An early whale that lived in the Eocene epoch",
    model: "/models/whale/Pakicetus3D.glb",
    startMa: 50,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Archaeopteryx",
    description: "The first bird",
    model: "/models/chicken/Archaeopteryx3D.glb",
    startMa: 150,
    eraId: "mesozoic",
    thumb: "/images/mesozoic.png",
  },
  {
    name: "Whale",
    description: "The largest mammal in the world",
    model: "/models/whale/Whale3D.glb",
    startMa: 30,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "tyrannosaurus rex",
    description: "One of the largest land carnivores of all time",
    model: "/models/chicken/tyranosaurus3D.glb",
  },
];

export default animals;
