import React, { useEffect, useState } from "react";
import { Link } from "../../components/Link";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

interface PokemonSpecies {
  names: { language: { name: string }; name: string }[];
}

export default function Page() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null); 

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
      .then((response) => response.json())
      .then((data) => {
        const pokemonPromises = data.results.map((pokemon: any) =>
          fetch(pokemon.url).then((response) => response.json())
        );

        Promise.all(pokemonPromises).then((pokemonData) => {
          const pokemonWithFrenchNames: Pokemon[] = [];

          const speciesPromises = pokemonData.map((pokemon: any) =>
            fetch(pokemon.species.url)
              .then((response) => response.json())
              .then((species: PokemonSpecies) => {
                const frenchName = species.names.find(
                  (name) => name.language.name === "fr"
                )?.name;

                pokemon.name = frenchName || pokemon.name;
                pokemonWithFrenchNames.push(pokemon);
              })
          );

          Promise.all(speciesPromises).then(() => {
            setPokemonList(pokemonWithFrenchNames);
          });
        });
      });
  }, []);

  const openModal = (slotId: number) => {
    setSelectedSlot(slotId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSearchQuery("");
  };

  const selectPokemon = (pokemon: Pokemon) => {
    if (selectedSlot !== null) {
      const slot = document.getElementById(`${selectedSlot}`);
      if (slot) {
        slot.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />`;
        setSelectedPokemon(pokemon);
      }
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
        <div className="equipe-container">
          {[1, 2, 3, 4, 5, 6].map((slotId) => (
            <div
              key={slotId}
              className="slot"
              id={slotId.toString()}
              onClick={() => openModal(slotId)} 
            />
          ))}
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
              <ul>
                {filteredPokemonList.map((pokemon) => (
                  <li key={pokemon.id} onClick={() => selectPokemon(pokemon)}>
                    {pokemon.name}
                  </li>
                ))}
              </ul>
              <button className="close-btn" onClick={closeModal}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
