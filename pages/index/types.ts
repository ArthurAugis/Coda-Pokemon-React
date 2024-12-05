export type Pokemon = {
  id: string;
  name: string;
};

export type PokemonDetails = Pokemon & {
  abilities: {
    ability: {
      name: string;
      url: string;  
      frenchNameAbility: string;
    };
  }[];
  base_experience: number;
  cries: {
    latest: string;
    legacy: string;
  };
  height: number;
  moves: {
    move: {
      name: string;
      url: string;
    };
  };
  // A voir si je met les moves car ça risques de faire vraiment trop d'informations sur la page
  species: {
    name: string;
    url: string;
  };
  sprites: {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  };
  // A reflechir si je met les sprites pour chaque jeux
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  };
  types: {
    [x: string]: any;
    slot: number;
    type: {
      name: string;
      frenchNameType: string;
      url: string;
    };
  };
  weight: number;
  frenchName: string;
  variants: {
    map(arg0: (variant: { pokemon: { name: React.Key | null | undefined; }; }) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    pokemon: {
      name: string;
      url: string;
      variantFrenchName: string;
    }
  };
  is_legendary: boolean;
  is_mythical: boolean;
  captureRate: number;
};
