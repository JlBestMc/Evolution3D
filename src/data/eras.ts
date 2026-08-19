export interface Subera {
  id: string;
  eraId: string;
  name: string;
  image: string;
  background: string;
  period: string;
  milestone: string;
  description: string;
  featuredSpeciesCount: number;
}

export interface Era {
  id: string;
  name: string;
  image: string;
  background: string;
  video: string;
  color: string;
  period: string;
  environment: string;
  milestone: string;
  transition: string;
  specimenName: string;
  description: string;
  duration: string;
  climate: string;
  life: string;
  legacy: string;
  highlights: string[];
  suberas: Subera[];
}

const subera = (
  eraId: string,
  image: string,
  background: string,
  details: Omit<Subera, "eraId" | "image" | "background">
): Subera => ({ eraId, image, background, ...details });

export const eras: Era[] = [
  {
    id: "precambrian",
    name: "Precambrian Era",
    image: "/images/precambrian.png",
    background: "/skydome/precambrianEra.png",
    video: "/videos/Precambrian.mp4",
    color: "#2b6cb0",
    period: "4600 Ma – 541 Ma",
    environment: "Oceans, volcanic shores",
    milestone: "Oxygen transforms the planet",
    transition: "Life begins",
    specimenName: "Cyanobacteria",
    description:
      "Formation of Earth, early atmosphere, first simple life (bacteria, algae).",
    duration: "≈ 4.06 billion years",
    climate: "Volcanic coastlines, shallow seas and a changing atmosphere.",
    life: "Microbial mats, algae and the first simple cells.",
    legacy: "Oxygenation and cellular complexity create the conditions for every later ecosystem.",
    highlights: [
      "Earth and its first oceans take shape",
      "Photosynthesis begins changing the atmosphere",
      "The first complex cells emerge",
    ],
    suberas: [
      subera("precambrian", "/images/precambrian.png", "/skydome/precambrianEra.png", {
        id: "hadean",
        name: "Hadean",
        period: "4600 – 4000 Ma",
        milestone: "Earth takes shape",
        description: "A young planet cools from a molten beginning into its first crust and oceans.",
        featuredSpeciesCount: 0,
      }),
      subera("precambrian", "/images/precambrian.png", "/skydome/precambrianEra.png", {
        id: "archean",
        name: "Archean",
        period: "4000 – 2500 Ma",
        milestone: "Life finds a foothold",
        description: "Microbial mats spread through shallow seas while the first stable continents emerge.",
        featuredSpeciesCount: 2,
      }),
      subera("precambrian", "/images/precambrian.png", "/skydome/precambrianEra.png", {
        id: "proterozoic",
        name: "Proterozoic",
        period: "2500 – 541 Ma",
        milestone: "Oxygen reshapes the atmosphere",
        description: "Oxygen accumulates and complex cells prepare the conditions for larger life.",
        featuredSpeciesCount: 4,
      }),
    ],
  },
  {
    id: "paleozoic",
    name: "Paleozoic Era",
    image: "/images/paleozoic.png",
    background: "/skydome/paleozoicEra.png",
    video: "/videos/Paleozoic.mp4",
    color: "#d4b24a",
    period: "541 – 252 Ma",
    environment: "Shallow seas, first forests",
    milestone: "Life moves from water to land",
    transition: "Life moves ashore",
    specimenName: "Tiktaalik",
    description:
      "The age of ancient seas. Life emerged, diversified and evolved in incredible ways. From the first marine invertebrates to the great terrestrial colonization.",
    duration: "≈ 289 million years",
    climate: "Shallow inland seas, humid forests and expanding terrestrial habitats.",
    life: "Marine invertebrates, fishes, land plants, insects and early reptiles.",
    legacy: "The anatomy of life changes forever as ecosystems establish themselves on land.",
    highlights: [
      "Marine life diversifies rapidly",
      "Plants and arthropods colonize the continents",
      "The first forests and complex food webs appear",
    ],
    suberas: [
      subera("paleozoic", "/images/paleozoic.png", "/skydome/paleozoicEra.png", {
        id: "cambrian",
        name: "Cambrian",
        period: "541 – 485 Ma",
        milestone: "Animal life diversifies",
        description: "A burst of body plans fills the seas with new predators, grazers and armored life.",
        featuredSpeciesCount: 3,
      }),
      subera("paleozoic", "/images/paleozoic.png", "/skydome/paleozoicEra.png", {
        id: "ordovician",
        name: "Ordovician",
        period: "485 – 444 Ma",
        milestone: "The seas become richer",
        description: "Marine ecosystems expand across a world of shallow seas, reefs and cephalopod hunters.",
        featuredSpeciesCount: 4,
      }),
      subera("paleozoic", "/images/paleozoic.png", "/skydome/paleozoicEra.png", {
        id: "silurian",
        name: "Silurian",
        period: "444 – 419 Ma",
        milestone: "The first forests take root",
        description: "Plants establish themselves on land while jawed fishes and reef communities spread.",
        featuredSpeciesCount: 4,
      }),
      subera("paleozoic", "/images/paleozoic.png", "/skydome/paleozoicEra.png", {
        id: "devonian",
        name: "Devonian",
        period: "419 – 359 Ma",
        milestone: "Life moves toward land",
        description: "Fishes diversify while forests and the first four-limbed pioneers transform the shore.",
        featuredSpeciesCount: 5,
      }),
      subera("paleozoic", "/images/paleozoic.png", "/skydome/paleozoicEra.png", {
        id: "carboniferous",
        name: "Carboniferous",
        period: "359 – 299 Ma",
        milestone: "Forests become coal",
        description: "Vast swamp forests build oxygen-rich ecosystems while insects and early amniotes spread.",
        featuredSpeciesCount: 5,
      }),
      subera("paleozoic", "/images/paleozoic.png", "/skydome/paleozoicEra.png", {
        id: "permian",
        name: "Permian",
        period: "299 – 252 Ma",
        milestone: "A supercontinent reaches its limit",
        description: "Dry interiors favor resilient reptiles before the largest extinction reshapes life.",
        featuredSpeciesCount: 4,
      }),
    ],
  },
  {
    id: "mesozoic",
    name: "Mesozoic Era",
    image: "/images/mesozoic.png",
    background: "/skydome/mesozoic3.png",
    video: "/videos/Mesozoic.mp4",
    color: "#287c1b",
    period: "252 – 66 Ma",
    environment: "Pangaea, warm forests",
    milestone: "Dinosaurs dominate the continents",
    transition: "Age of dinosaurs",
    specimenName: "Archaeopteryx",
    description:
      "Age of dinosaurs, early mammals and birds, breakup of Pangaea.",
    duration: "≈ 186 million years",
    climate: "A warm greenhouse world, broad conifer forests and rising sea levels.",
    life: "Dinosaurs, marine reptiles, early birds, flowering plants and mammals.",
    legacy: "The dinosaur-bird lineage survives the mass extinction and still shapes life today.",
    highlights: [
      "Pangaea breaks into modern continental fragments",
      "Dinosaurs dominate terrestrial ecosystems",
      "Birds and flowering plants begin their long rise",
    ],
    suberas: [
      subera("mesozoic", "/images/mesozoic.png", "/skydome/mesozoic3.png", {
        id: "triassic",
        name: "Triassic",
        period: "252 – 201 Ma",
        milestone: "Dinosaurs make their first appearance",
        description: "Life recovers from extinction as the first dinosaurs and early mammals share a warming world.",
        featuredSpeciesCount: 4,
      }),
      subera("mesozoic", "/images/mesozoic.png", "/skydome/mesozoic2.png", {
        id: "jurassic",
        name: "Jurassic",
        period: "201 – 145 Ma",
        milestone: "Giants rule the forest",
        description: "Humid forests and broad seas support immense sauropods, marine reptiles and feathered hunters.",
        featuredSpeciesCount: 7,
      }),
      subera("mesozoic", "/images/mesozoic.png", "/skydome/mesozoic3.png", {
        id: "cretaceous",
        name: "Cretaceous",
        period: "145 – 66 Ma",
        milestone: "Flowering plants reshape the food web",
        description: "Continents drift apart as flowering plants spread and dinosaurs reach their final diversity.",
        featuredSpeciesCount: 8,
      }),
    ],
  },
  {
    id: "cenozoic",
    name: "Cenozoic Era",
    image: "/images/cenozoic.png",
    background: "/skydome/cenozoicEra.png",
    video: "/videos/Cenozoic.mp4",
    color: "#6b4f9a",
    period: "66 Ma – present",
    environment: "Ice ages, grasslands, cities",
    milestone: "Mammals and humans reshape life",
    transition: "Rise of mammals",
    specimenName: "Pakicetus",
    description: "Rise of mammals, modern climates, evolution of humans.",
    duration: "66 million years to present",
    climate: "Cooling climates, ice ages, grasslands and increasingly human-shaped landscapes.",
    life: "Mammals, modern birds, flowering plants and the human lineage.",
    legacy: "The living world becomes recognizable, while humans become a geological force of their own.",
    highlights: [
      "Mammals diversify into nearly every habitat",
      "Grasslands and ice-age ecosystems expand",
      "Humans emerge and transform the biosphere",
    ],
    suberas: [
      subera("cenozoic", "/images/cenozoic.png", "/skydome/cenozoicEra.png", {
        id: "paleogene",
        name: "Paleogene",
        period: "66 – 23 Ma",
        milestone: "Mammals fill the open niches",
        description: "After the dinosaur extinction, mammals and birds rapidly occupy newly available habitats.",
        featuredSpeciesCount: 6,
      }),
      subera("cenozoic", "/images/cenozoic.png", "/skydome/cenozoicEra.png", {
        id: "neogene",
        name: "Neogene",
        period: "23 – 2.58 Ma",
        milestone: "Grasslands change the silhouette of life",
        description: "Cooling climates and open grasslands drive new grazers, hunters and the first hominins.",
        featuredSpeciesCount: 8,
      }),
      subera("cenozoic", "/images/cenozoic.png", "/skydome/cenozoicEra.png", {
        id: "quaternary",
        name: "Quaternary",
        period: "2.58 Ma – present",
        milestone: "Humans become a geological force",
        description: "Ice ages, modern ecosystems and human expansion define the most recent chapter of deep time.",
        featuredSpeciesCount: 10,
      }),
    ],
  },
];
