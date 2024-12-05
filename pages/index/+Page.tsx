import React, { useEffect, useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  frenchName: string;
}

export default function Page() {
  const [count, setCount] = useState(30); // Nombre de Pokémon à afficher
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  ); // ID du Pokémon sélectionné
  const [selectedImage, setSelectedImage] = useState<string>(
    "../../assets/noname.jpg"
  );

  useEffect(() => {
    // Fetch Pokémon data
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`)
      .then((response) => response.json())
      .then((data) => {
        const pokemonPromises = data.results.map((pokemon: any) =>
          fetch(pokemon.url).then((response) => response.json())
        );

        Promise.all(pokemonPromises).then((pokemonData) => {
          // Sort by ID
          const sortedPokemonData = pokemonData.sort(
            (a: any, b: any) => a.id - b.id
          );

          // Fetch species data for all Pokémon
          const speciesPromises = sortedPokemonData.map((data: any) =>
            fetch(data.species.url).then((response) => response.json())
          );

          Promise.all(speciesPromises).then((speciesDataArray) => {
            const enrichedPokemonData = sortedPokemonData.map(
              (pokemon: any, index: number) => {
                const speciesData = speciesDataArray[index];
                const frenchName = speciesData.names.find(
                  (name: any) => name.language.name === "fr"
                ).name;

                return {
                  ...pokemon,
                  frenchName,
                };
              }
            );
            setPokemonList(enrichedPokemonData);
          });
        });
      });
  }, [count]);

  const handleMouseOver = (pokemon: Pokemon) => {
    setSelectedImage(pokemon.sprites.front_default);
    setSelectedPokemonId(pokemon.id);
  };

  return (
    <>
      <header>
        <a href="https://bit.ly/EasterEgg_Projet_Pikachu">
          <button className="title">Pokedex de Coda</button>
        </a>
        <button className="pokemon-number">
          <img src="../../assets/pokeball.ico" id="pokeball" alt="Pokeball" />
          {count}
        </button>
      </header>
      <div className="container">
        <div className="pokemon-img-container">
          <img src={selectedImage} id="pokemon-img" alt="Selected Pokémon" />
          <a
            href="https://github.com/ArthurAugis/Coda-Pokemon-React"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="github">Github</button>
          </a>
        </div>
        <div className="pokemon-liste">
          {pokemonList.map((pokemon) => (
            <div key={pokemon.id}>
              <a href={`/${pokemon.id}`}>
                <button
                  className={`pokemon ${
                    selectedPokemonId === pokemon.id ? "selected" : ""
                  }`}
                  onMouseOver={() => handleMouseOver(pokemon)}
                >
                  {pokemon.frenchName}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
