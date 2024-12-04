import React, { useEffect, useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);

  // Nombre de pokemons à afficher (1025 max pour la dixième génération. PS : à éviter de mettre 1025, l'api peut être longue à répondre) 
  const numberOfPokemon = 1025;

  useEffect(() => {
    setCount(numberOfPokemon);
  }, [numberOfPokemon]);
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=" + numberOfPokemon)
      .then((response) => response.json())
      .then((data) => {
        const pokemonPromises = data.results.map((pokemon: any) =>
          fetch(pokemon.url).then((response) => response.json())
        );
  
        Promise.all(pokemonPromises).then((pokemonData) => {
          const sortedPokemonData = pokemonData.sort((a: any, b: any) => a.id - b.id);
  
          sortedPokemonData.forEach((data: any) => {
            // Fetch species data to get the name in French
            fetch(data.species.url)
              .then((response) => response.json())
              .then((speciesData) => {
                const frenchName = speciesData.names.find((name: any) => name.language.name === "fr").name;
  
                const pokemonElement = document.createElement("div");
                pokemonElement.innerHTML = `
                  <a href="${data.id}">
                  <button class="pokemon" data-image="${data.sprites.front_default}">
                  ${frenchName}
                  </button>
                  </a>
                `;
                const pokemonList = document.querySelector(".pokemon-liste");
                if (pokemonList) {
                  pokemonList.appendChild(pokemonElement);
  
                  const button = pokemonElement.querySelector(".pokemon");
                  if (button) {
                    button.addEventListener("mouseover", function () {
                      const pokemonButtons = document.querySelectorAll(".pokemon");
                      const newSelectedPokemonImage = button.getAttribute("data-image");
                      const pokemonImg = document.querySelector("#pokemon-img");
                      let selectedPokemonImage = null;
                      if (selectedPokemonImage !== newSelectedPokemonImage) {
                        selectedPokemonImage = newSelectedPokemonImage;
                        if (pokemonImg) {
                          (pokemonImg as HTMLImageElement).src = selectedPokemonImage;
                        }
                        pokemonButtons.forEach(function (otherButton) {
                          if (otherButton !== button) {
                            otherButton.classList.remove("selected");
                          }
                        });
                        button.classList.add("selected");
                      }
                    });
                  }
                }
              });
          });
        });
      });
  }, [numberOfPokemon]);

  return (
    <>
      <header>
        <a href="https://bit.ly/EasterEgg_Projet_Pikachu">
          <button className="title">Pokedex de Coda</button>
        </a>
        <button className="pokemon-number">
          <img src="../../assets/pokeball.ico" id="pokeball"></img>
          {count}
        </button>
      </header>
      <div className="container">
        <div className="pokemon-img-container">
          <img src="../../assets/noname.jpg" id="pokemon-img"></img>
          <a
            href="https://github.com/ArthurAugis/Coda-Pokemon-React"
            target="_blank"
          >
            <button className="github">Github</button>
          </a>
        </div>
        <div className="pokemon-liste"></div>
      </div>
    </>
  );
}
