import React, { useEffect, useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  frenchName: string;
  types: { type: { name: string; frenchName: string } }[];
}

export default function Page() {
  const [count, setCount] = useState(1025); // Nombre de Pokémon à afficher (Max 1025 à éviter pour ne pas faire surchauffer l'API)
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    "../../assets/noname.jpg"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/type")
      .then((response) => response.json())
      .then((typeData) => {
        const typePromises = typeData.results.map((type: any) =>
          fetch(type.url).then((response) => response.json())
        );

        Promise.all(typePromises).then((typeDetails) => {
          const frenchTypes = typeDetails.map((typeDetail: any) => ({
            english: typeDetail.name,
            french: typeDetail.names.find(
              (name: any) => name.language.name === "fr"
            ).name,
          }));
          setAvailableTypes(frenchTypes.map((type) => type.french));

          fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`)
            .then((response) => response.json())
            .then((data) => {
              const pokemonPromises = data.results.map((pokemon: any) =>
                fetch(pokemon.url).then((response) => response.json())
              );

              Promise.all(pokemonPromises).then((pokemonData) => {
                const speciesPromises = pokemonData.map((data: any) =>
                  fetch(data.species.url).then((response) => response.json())
                );

                Promise.all(speciesPromises).then((speciesDataArray) => {
                  const enrichedPokemonData = pokemonData.map(
                    (pokemon: any, index: number) => {
                      const speciesData = speciesDataArray[index];
                      const frenchName = speciesData.names.find(
                        (name: any) => name.language.name === "fr"
                      ).name;

                      // Traduire les types des Pokémon
                      const translatedTypes = pokemon.types.map(
                        (typeObj: any) => {
                          const frenchType = frenchTypes.find(
                            (type) => type.english === typeObj.type.name
                          );
                          return {
                            ...typeObj,
                            type: {
                              ...typeObj.type,
                              frenchName: frenchType
                                ? frenchType.french
                                : typeObj.type.name,
                            },
                          };
                        }
                      );

                      return {
                        ...pokemon,
                        frenchName,
                        types: translatedTypes,
                      };
                    }
                  );

                  setPokemonList(enrichedPokemonData);
                });
              });
            });
        });
      });
  }, [count]);

  const handleMouseOver = (pokemon: Pokemon) => {
    setSelectedImage(pokemon.sprites.front_default);
    setSelectedPokemonId(pokemon.id);
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredPokemon = pokemonList.filter((pokemon) => {
    const matchesName = pokemon.frenchName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.every((selectedType) =>
        pokemon.types.some((t) => t.type.frenchName === selectedType)
      );
    return matchesName && matchesType;
  });

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
          <input
            type="text"
            placeholder="Rechercher un Pokémon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="type-filter">
            {availableTypes
              .filter((type) => type !== "???")
              .map((type) => (
                <label key={type} className="type-checkbox">
                  <input
                    type="checkbox"
                    value={type}
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                  />
                  {type}
                </label>
              ))}
          </div>
        </div>
        <div className="pokemon-liste">
          {filteredPokemon.map((pokemon) => (
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
