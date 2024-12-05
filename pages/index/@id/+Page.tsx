import React, { useEffect } from "react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data.js";

export default function Page() {
  const pokemon = useData<Data>();

  useEffect(() => {
    console.log(pokemon);
  });

  return (
    <>
      <header>
        <a href="https://bit.ly/EasterEgg_Projet_Pikachu">
          <button className="title">Pokedex de Coda</button>
        </a>
        <button className="pokemon-number">
          <img src="../../assets/pokeball.ico" id="pokeball"></img>
          1025
        </button>
      </header>
      <div className="pokemon-details-container">
        <div className="pokemon-img-container-2">
          <img
            id="pokemon-img"
            src="bulbizarre.png"
            alt="Image de Bulbizarre"
          />
        </div>
        <div className="pokemon-info">
          Info sur le pokémon récupérer avec PokeAPI
        </div>
      </div>
    </>
  );
}