// https://vike.dev/data

import type { PageContextServer } from "vike/types";
import type { PokemonDetails } from "../types";

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async (pageContext: PageContextServer) => {

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pageContext.routeParams.id}`);
  let pokemon = (await response.json()) as PokemonDetails;

  pokemon = minimize(pokemon);

  return pokemon;
};

function minimize(pokemon: PokemonDetails): PokemonDetails {
  const { id, abilities, name } = pokemon;
  const minimizedPokemon = { id, abilities, name };
  return minimizedPokemon;
}
