interface Animal {
  name: string;
  description: string;
  model: string;
}

const animals: Animal[] = [
  {
    name: "Chicken",
    description: "A domesticated bird raised for its eggs and meat",
    model: "../../assets/models/chicken.glb"
  },
  {
    name: "Archaeopteryx",
    description: "The first bird",
    model: "../../assets/models/archaeopteryx.glb"
  },
  {
    name: "Whale",
    description: "The largest mammal in the world",
    model: "../../assets/models/whale.glb"
  }
];

export default animals;