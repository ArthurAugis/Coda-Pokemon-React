import React, { useState, useEffect } from "react";
import { onSaveSlot, getTeam, onDeleteSlot } from "./Page.telefunc";
import { Link } from "../../components/Link";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
    front_female?: string;
    front_shiny_female?: string;
  };
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string; frenchName: string } }[];
}

interface TeamSlot {
  slot: number;
  pokemon: string | null;
  isShiny: boolean;
  isFemale: boolean;
}

export default function Page() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [team, setTeam] = useState<TeamSlot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFemale, setIsFemale] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [teamData, pokemonData] = await Promise.all([getTeam(), fetchPokemonList()]);
      setTeam(teamData);
      setPokemonList(pokemonData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const fetchPokemonList = async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();

    const pokemonPromises = data.results.map((pokemon: any) =>
      fetch(pokemon.url)
        .then((res) => res.json())
        .then(async (pokemonData) => {
          const speciesResponse = await fetch(pokemonData.species.url);
          const speciesData = await speciesResponse.json();

          const frenchName = speciesData.names.find(
            (entry: any) => entry.language.name === "fr"
          )?.name;

          const translatedTypes = await Promise.all(
            pokemonData.types.map(async (typeObj: any) => {
              const typeResponse = await fetch(typeObj.type.url);
              const typeData = await typeResponse.json();

              const frenchTypeName = typeData.names.find(
                (entry: any) => entry.language.name === "fr"
              )?.name;

              return {
                ...typeObj,
                type: {
                  ...typeObj.type,
                  frenchName: frenchTypeName || typeObj.type.name,
                },
              };
            })
          );

          return {
            id: pokemonData.id,
            name: frenchName || pokemonData.name,
            sprites: {
              front_default: pokemonData.sprites.front_default,
              front_shiny: pokemonData.sprites.front_shiny,
              front_female: pokemonData.sprites.front_female,
              front_shiny_female: pokemonData.sprites.front_shiny_female
            },
            stats: pokemonData.stats,
            types: translatedTypes,
          };
        })
    );

    return await Promise.all(pokemonPromises);
  };

  const calculateTeamStats = () => {
    const teamPokemons = team
      .map((slot) => pokemonList.find((pokemon) => pokemon.name === slot.pokemon))
      .filter(Boolean) as Pokemon[];

    const statsAverage: { [key: string]: number } = {};
    const typeCounts: { [key: string]: number } = {};

    teamPokemons.forEach((pokemon) => {
      pokemon.stats.forEach((stat) => {
        const translatedStatName = translateStatName(stat.stat.name);
        statsAverage[translatedStatName] =
          (statsAverage[translatedStatName] || 0) + stat.base_stat;
      });

      pokemon.types.forEach((type) => {
        const frenchType = type.type.frenchName;
        typeCounts[frenchType] = (typeCounts[frenchType] || 0) + 1;
      });
    });

    Object.keys(statsAverage).forEach(
      (key) => (statsAverage[key] = statsAverage[key] / teamPokemons.length || 0)
    );

    return { statsAverage, typeCounts };
  };

  const translateStatName = (statName: string): string => {
    switch (statName) {
      case "hp":
        return "HP";
      case "attack":
        return "Attaque";
      case "defense":
        return "Défense";
      case "special-attack":
        return "Attaque spéciale";
      case "special-defense":
        return "Défense spéciale";
      case "speed":
        return "Vitesse";
      default:
        return statName;
    }
  };

  const { statsAverage, typeCounts } = calculateTeamStats();

  const openModal = (slotId: number) => {
    setSelectedSlot(slotId);
    setModalOpen(true);
    setIsShiny(false);
    setIsFemale(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSearchQuery("");
  };

  const selectPokemon = async (pokemon: Pokemon) => {
    if (selectedSlot !== null) {
      const updatedSlot = await onSaveSlot(selectedSlot, pokemon.name, isShiny, isFemale);
      setTeam((prevTeam) =>
        prevTeam.some((slot) => slot.slot === selectedSlot)
          ? prevTeam.map((slot) => (slot.slot === selectedSlot ? updatedSlot : slot))
          : [...prevTeam, updatedSlot]
      );
    }
    closeModal();
  };

  const removePokemonFromSlot = async () => {
    if (selectedSlot !== null) {
      await onDeleteSlot(selectedSlot);
      setTeam((prevTeam) => prevTeam.filter((slot) => slot.slot !== selectedSlot));
    }
    closeModal();
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header>
        <a href="https://bit.ly/EasterEgg_Projet_Pikachu">
          <button className="title">Pokedex de Coda</button>
        </a>
        <Link href="/">
          <button className="pokemon-number">Retour à l'accueil</button>
        </Link>
      </header>
      <div className="page-equipe">
        {isLoading ? (
          <div className="loading">
            <h1>Chargement des données Pokémon...</h1>
          </div>
        ) : (
          <>
            <div className="equipe-container">
              {[1, 2, 3, 4, 5, 6].map((slotId) => {
                const slotData = team.find((slot) => slot.slot === slotId);
                const sprite = (() => {
                  const pokemon = pokemonList.find((p) => p.name === slotData?.pokemon);
                  if (!pokemon) return null;
                
                  if (slotData?.isShiny) {
                    return slotData?.isFemale && pokemon.sprites.front_shiny_female
                      ? pokemon.sprites.front_shiny_female
                      : pokemon.sprites.front_shiny;
                  } else {
                    return slotData?.isFemale && pokemon.sprites.front_female
                      ? pokemon.sprites.front_female
                      : pokemon.sprites.front_default;
                  }
                })();
                

                return (
                  <div
                    key={slotId}
                    className="slot"
                    id={slotId.toString()}
                    onClick={() => openModal(slotId)}
                  >
                    {sprite ? (
                      <img src={sprite} alt={slotData?.pokemon || ""} />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
            <div className="team-stats-container">
              <h2>Statistiques de l'équipe</h2>
              <ul>
                {Object.entries(statsAverage).map(([stat, value]) => (
                  <li key={stat}>
                    <strong>{stat} :</strong> {value.toFixed(2)}
                  </li>
                ))}
              </ul>
              <h2>Types de l'équipe</h2>
              <ul>
                {Object.entries(typeCounts).map(([type, count]) => (
                  <li key={type}>
                    <strong>{type} :</strong> {count}
                  </li>
                ))}
              </ul>
            </div>

            {modalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <input
                    type="text"
                    placeholder="Rechercher un Pokémon"
                    value={searchQuery}
                    className="search-input-modal"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={isShiny}
                      onChange={(e) => setIsShiny(e.target.checked)}
                    />
                    Shiny
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={isFemale}
                      onChange={(e) => setIsFemale(e.target.checked)}
                    />
                    Femelle
                  </label>
                  <ul>
                    {filteredPokemonList.map((pokemon) => (
                      <li key={pokemon.id} onClick={() => selectPokemon(pokemon)}>
                        {pokemon.name}
                      </li>
                    ))}
                  </ul>
                  <button className="remove-btn" onClick={removePokemonFromSlot}>
                    Supprimer le Pokémon
                  </button>
                  <button className="close-btn" onClick={closeModal}>
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
