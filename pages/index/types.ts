export type Pokemon = {
  id: string;
  name: string;
};

export type PokemonDetails = Pokemon & {
  abilities: {
    map(arg0: (ability: { ability: { name: any; }; }) => any): unknown;
    ability: {
      name: string;
    };
  };
};
