// https://vike.dev/data

import type { PageContextServer } from "vike/types";
import type { PokemonDetails } from "../types";
import { List } from "postcss/lib/list";

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async (pageContext: PageContextServer) => {

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pageContext.routeParams.id}`);
  let pokemon = (await response.json()) as PokemonDetails;
  
  pokemon = minimize(pokemon);

  const responseSpecies = await fetch(pokemon.species.url);
  let species = (await responseSpecies.json());
  const frenchName = species.names.find((name: any) => name.language.name === "fr").name;
  pokemon = { ...pokemon, frenchName };
  let variants = species.varieties;
  pokemon = { ...pokemon, variants };
  const is_legendary = species.is_legendary;
  pokemon = { ...pokemon, is_legendary };
  const is_mythical = species.is_mythical;
  pokemon = { ...pokemon, is_mythical };
  const captureRate = species.capture_rate;
  pokemon = { ...pokemon, captureRate };
  

  for (let i = 0; i < pokemon.types.length; i++) {
    const type = pokemon.types[i];
    const responseType = await fetch(type.type.url);
    const typeData = await responseType.json();
    const frenchNameType = typeData.names.find((name: any) => name.language.name === "fr").name;
    type.type = { ...type.type, frenchNameType };
  }

  for (let i = 0; i < pokemon.abilities.length; i++) {
    const ability = pokemon.abilities[i];
    const responseAbility = await fetch(ability.ability.url);
    const abilityData = await responseAbility.json();
    const frenchNameAbility = abilityData.names.find((name: any) => name.language.name === "fr").name;
    ability.ability = { ...ability.ability, frenchNameAbility };
  }

  return pokemon;
};

function minimize(pokemon: PokemonDetails): PokemonDetails {
  const { id, abilities, name, base_experience, cries, height, moves, species, sprites, stats, types, weight, frenchName, variants, is_legendary, is_mythical, captureRate } = pokemon;
  const minimizedPokemon = { id, abilities, name, base_experience, cries, height, moves, species, sprites, stats, types, weight, frenchName, variants, is_legendary, is_mythical, captureRate };
  return minimizedPokemon;
}
