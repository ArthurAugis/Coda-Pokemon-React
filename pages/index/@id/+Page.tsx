import React, { useEffect, useState } from "react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data.js";
import { Link } from "../../../components/Link.jsx";

export default function Page() {
  const pokemon = useData<Data>();
  const [selectedSprite, setSelectedSprite] = useState(
    pokemon.sprites.front_default
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pokemon && pokemon.sprites) {
      setSelectedSprite(pokemon.sprites.front_default);
      setIsLoading(false);
    }
  }, [pokemon]);

  const handleSpriteChange = (e: { target: { value: string } }) => {
    if (!pokemon.sprites[e.target.value as keyof typeof pokemon.sprites])
      return;
    const selectedIndex = e.target.value as keyof typeof pokemon.sprites;
    setSelectedSprite(pokemon.sprites[selectedIndex]);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <h1>Chargement des données Pokémon...</h1>
      </div>
    );
  }

  return (
    <>
      <header>
        <a href="https://bit.ly/EasterEgg_Projet_Pikachu">
          <button className="title">Pokedex de Coda</button>
        </a>
        <Link href={`/`}>
          <button className="pokemon-number">Retour à l'accueil</button>
        </Link>
      </header>
      <div className="pokemon-details-container">
        <div className="pokemon-img-container-2">
          <img
            id="pokemon-img"
            src={selectedSprite}
            alt={`Image de ${pokemon.name}`}
          />
        </div>
        <div className="pokemon-info">
          <p>
            <strong>Nom anglais : </strong>
            {pokemon.name}
          </p>
          <p>
            <strong>Nom français : </strong>
            {pokemon.frenchName}
          </p>
          <p>
            <strong>Id : </strong>
            {pokemon.id}
          </p>
          <p>
            <strong>Expérience de base : </strong>
            {pokemon.base_experience}
          </p>
          <p>
            <strong>Hauteur : </strong>
            {pokemon.height / 10}m
          </p>
          <p>
            <strong>Poids : </strong>
            {pokemon.weight / 10}kg
          </p>
          <p>
            <strong>Types : </strong>
            {pokemon.types
              .map(
                (type: { type: { frenchNameType: any } }) =>
                  type.type.frenchNameType
              )
              .join(", ")}
          </p>
          <p>
            <strong>Abilités : </strong>
            {pokemon.abilities
              .map((ability) => ability.ability.frenchNameAbility)
              .join(", ")}
          </p>
          <p>
            <strong>Statistiques : </strong>
          </p>
          {pokemon.stats.map((stat) => (
            <li key={stat.stat.name}>
              <strong>{stat.stat.name} : </strong>
              {stat.base_stat}
            </li>
          ))}
          <p>
            <strong>Taux de capture : </strong>
            {pokemon.captureRate} (Entre 1 et 255)
          </p>
          <p>
            <strong>Est légendaire : </strong>
            {pokemon.is_legendary ? "Oui" : "Non"}
          </p>
          <p>
            <strong>Est mythique : </strong>
            {pokemon.is_mythical ? "Oui" : "Non"}
          </p>
          <p>
            <strong>Variants : </strong>
            {pokemon.variants.length > 1
              ? pokemon.variants.map(
                  (variant: {
                    pokemon: { name: React.Key | null | undefined };
                  }) => (
                    <li key={variant.pokemon.name}>
                      <Link href={`/${variant.pokemon.name}`}>
                        {variant.pokemon.name}
                      </Link>
                    </li>
                  )
                )
              : "Aucun variant pour ce pokémon"}
          </p>
          <p>
            <strong>Sprites : </strong>
            <div>
              <select id="sprites" onChange={handleSpriteChange}>
                {Object.keys(pokemon.sprites).map((spriteKey) => {
                  if (!pokemon.sprites[spriteKey]) return null;
                  if (spriteKey === "versions" || spriteKey === "other")
                    return null;
                  if (spriteKey === "front_default") {
                    return (
                      <option key={spriteKey} value={spriteKey} selected>
                        {spriteKey}
                      </option>
                    );
                  } else {
                    return (
                      <option key={spriteKey} value={spriteKey}>
                        {spriteKey.replace("front_", "")}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
          </p>
          <p>
            <strong>Cries : </strong>
            {pokemon.cries.latest !== null ? (
              <li>
                Dernier cri : <audio controls src={pokemon.cries.latest} />
              </li>
            ) : null}

            {pokemon.cries.legacy !== null ? (
              <li>
                Premier cri : <audio controls src={pokemon.cries.legacy} />
              </li>
            ) : null}
          </p>
        </div>
      </div>
    </>
  );
}
