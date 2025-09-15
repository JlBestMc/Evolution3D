export interface Animal {
  name: string;
  description: string;
  subtitle?: string; // breve texto para usar en EraPage/Card overlays
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
    subtitle: "Early whale ancestor from the Eocene.",
    description:
      "Pakicetus is one of the earliest known whales, living during the early Eocene about 50 million years ago. Unlike modern whales, it spent much of its time on land and likely hunted in shallow waters. Fossils show features that link it to hoofed mammals, highlighting the dramatic transition from land to sea in whale evolution.",
    model: "/models/Pakicetus3D.glb",
    startMa: 50,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Trilobite",
    subtitle: "Iconic Paleozoic marine arthropod.",
    description:
      "Trilobites were diverse, hard-shelled arthropods that thrived in ancient oceans for more than 270 million years. Their segmented bodies and compound eyes made them remarkably successful. They are among the most recognizable fossils, helping scientists date rock layers and understand early marine ecosystems.",
    model: "/models/Trilobite3D.glb",
    startMa: 500,
    eraId: "paleozoic",
    thumb: "/images/paleozoic.png",
  },
  {
    name: "Cameroceras",
    subtitle: "Giant straight-shelled cephalopod.",
    description:
      "Cameroceras was a massive orthoconic (straight-shelled) cephalopod that prowled Ordovician seas. As an active predator, it likely used jet propulsion to ambush prey. Its impressive size and long shell made it one of the top predators of its time.",
    model: "/models/Cameroceras3D.glb",
    startMa: 500,
    eraId: "paleozoic",
    thumb: "/images/paleozoic.png",
  },
  {
    name: "Archaeopteryx",
    subtitle: "Transitional form between dinos and birds.",
    description:
      "Archaeopteryx is often cited as the first bird, bridging dinosaurs and modern avians. It had feathers and wings but also teeth and a long bony tail. Its fossils provide crucial evidence for the evolution of flight and the dinosaur-bird connection.",
    model: "/models/Archaeopteryx3D_draco.glb",
    startMa: 154,
    eraId: "mesozoic",
    thumb: "/images/mesozoic.png",
  },
  {
    name: "Whale",
    subtitle: "The largest living mammal.",
    description:
      "Modern whales include some of the largest animals to have ever lived on Earth. Evolved from land-dwelling ancestors, whales are fully adapted to marine life, using powerful tails for propulsion and sophisticated social behaviors for communication and hunting.",
    model: "/models/Whale3D.glb",
    startMa: 30,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "tyrannosaurus rex",
    subtitle: "Legendary apex predator of the Cretaceous.",
    description:
      "Tyrannosaurus rex was a colossal theropod dinosaur with powerful jaws and bone-crushing teeth. Living at the end of the Cretaceous, it dominated terrestrial ecosystems. Fossil evidence suggests keen senses and complex behavior, making it an enduring icon of prehistoric life.",
    model: "/models/T-rex.glb",
    startMa: 62,
    eraId: "mesozoic",
    thumb: "/images/mesozoic.png",
  },
  {
    name: "Chicken",
    subtitle: "Domesticated bird with dinosaur roots.",
    description:
      "The domestic chicken descends from wild junglefowl and has been bred by humans for thousands of years. Its anatomy and genetics reflect deep evolutionary ties to dinosaurs, offering a living glimpse into avian evolution.",
    model: "/models/Chicken3D.glb",
    startMa: 0.01,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Brachiosaurus",
    subtitle: "High-browsing Late Jurassic sauropod.",
    description:
      "Brachiosaurus was a towering sauropod with long forelimbs and an elevated neck, adapted to browsing treetops. Its unique body plan distinguished it from other sauropods and shaped Late Jurassic ecosystems.",
    model: "/models/Brachiosaurus3D.glb",
    startMa: 154,
    eraId: "mesozoic",
    thumb: "/images/mesozoic.png",
  },
  {
    name: "Elephant",
    subtitle: "The largest land animal alive.",
    description:
      "Elephants are intelligent, social mammals known for their trunks, tusks, and complex family structures. They shape their habitats by knocking down trees and dispersing seeds, earning the title of ecosystem engineers.",
    model: "/models/Elephant3D.glb",
    startMa: 5,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Mamenchisaurus",
    subtitle: "Dinosaur famed for extremely long neck.",
    description:
      "Mamenchisaurus is renowned for its extraordinarily long neck, comprising over half its body length. This adaptation likely allowed efficient feeding across wide areas without moving the heavy body.",
    model: "/models/Mamenchisaurus3D.glb",
    startMa: 165,
    eraId: "mesozoic",
    thumb: "/images/mesozoic.png",
  },
  {
    name: "Mammoth",
    subtitle: "Woolly giant of the Ice Age.",
    description:
      "Woolly mammoths roamed Ice Age steppes, adapted to cold with thick fur and curved tusks. Their remains, preserved in permafrost, reveal details of their lives and eventual extinction as climates warmed and humans spread.",
    model: "/models/Mammoth3D.glb",
    startMa: 1,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Megalodon",
    subtitle: "Enormous prehistoric shark.",
    description:
      "Megalodon was a gigantic shark that hunted whales and large marine animals. Its fossilized teeth are widespread and indicate an animal far larger than any living shark, dominating oceans millions of years ago.",
    model: "/models/Megalodon3D.glb",
    startMa: 23,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
   {
    name: "Charniodiscus",
    subtitle: "Ediacaran soft-bodied organism.",
    description:
      "Charniodiscus lived in the Ediacaran period before the rise of complex animal bodies. Its frond-like shape represents some of the earliest large multicellular life, offering clues to the origins of modern animals.",
    model: "/models/Charniodiscus3D.glb",
    startMa: 555,
    eraId: "precambrian",
    thumb: "/images/precambrian.png",
  },
  {
    name: "Gallimimus",
    subtitle: "Fast, ostrich-like ornithomimosaur.",
    description:
      "Gallimimus was a swift, lightly built dinosaur resembling modern ostriches. It likely fed opportunistically, using speed to avoid predators and cover large territories.",
    model: "/models/Gallimimus3D.glb",
    startMa: 70,
    eraId: "mesozoic",
    thumb: "/images/mesozoic.png",
  },
  {
    name: "Jellyfish (aurelia aurita)",
    subtitle: "Simple gelatinous drifter of ancient seas.",
    description:
      "Jellyfish are ancient, simple animals with radial symmetry and stinging tentacles. They have persisted for hundreds of millions of years, drifting with currents and playing key roles in marine food webs.",
    model: "/models/Jellyfish3D.glb",
    startMa: 700,
    eraId: "precambrian",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Moose",
    subtitle: "Large deer adapted to cold wetlands.",
    description:
      "Moose are the largest members of the deer family, adapted to boreal forests and marshes. Their long legs and broad hooves help navigate wetlands, while impressive antlers adorn adult males.",
    model: "/models/Moose3D.glb",
    startMa: 0.01,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Sperm Whale",
    subtitle: "Deep-diving toothed whale predator.",
    description:
      "The sperm whale is the largest toothed predator on Earth, capable of diving more than a kilometer to hunt giant squid. Its massive head houses the spermaceti organ, aiding in buoyancy and echolocation.",
    model: "/models/SpermWhale3D.glb",
    startMa: 0.01,
    eraId: "cenozoic",
    thumb: "/images/cenozoic.png",
  },
  {
    name: "Triceratops",
    subtitle: "Horned herbivore with iconic frill.",
    description:
      "Triceratops was a sturdy, horned dinosaur with a large frill that may have been used for display, defense, or thermoregulation. It lived alongside Tyrannosaurus in the late Cretaceous of North America.",
    model: "/models/Triceratops3D.glb",
    startMa: 68,
    eraId: "mesozoic",
    thumb: "/images/mesozoic.png",
  },
  {
    name: "Cyanobacteria",
    subtitle: "Photosynthetic pioneers of early Earth.",
    description:
      "Cyanobacteria are among the oldest life forms, responsible for oxygenating Earth’s early atmosphere through photosynthesis. Their activity paved the way for complex life to evolve.",
    model: "/models/Cyanobacteria3D.glb",
    startMa: 2500,
    eraId: "precambrian",
    thumb: "/images/precambrian.png",
  },
];

export default animals;
