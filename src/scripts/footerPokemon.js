import { fetchPokemon } from './api.js';
import { renderPokemonDetails } from './render.js';

// Función para obtener un Pokémon aleatorio
const getRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 1000) + 1; 
  return await fetchPokemon(randomId);
};

// Función para obtener Pokémon por nombre
const getPokemonByName = async (name) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching the Pokémon data', error);
    return null;
  }
};


// Función para crear y mostrar tarjetas de Pokémon
const createPokemonCard = (pokemon) => {
  if (!pokemon) return null;

  const typeClass = getTypeClass(pokemon.types[0].type.name);
  const pokemonCard = document.createElement('div');
  pokemonCard.classList.add('pokemon-card', typeClass);
  pokemonCard.dataset.pokemonId = pokemon.id; // Añadir el ID del Pokémon como data-attribute

  // Añadir la imagen del Pokémon
  const pokemonImg = document.createElement('img');
  pokemonImg.src = pokemon.sprites.other["official-artwork"].front_default;
  pokemonImg.alt = pokemon.name;
  pokemonImg.classList.add('pokemon-img');

  // Añadir el nombre del Pokémon
  const pokemonName = document.createElement('p');
  pokemonName.textContent = pokemon.name;
  pokemonName.classList.add('pokemon-name');

  pokemonCard.appendChild(pokemonImg);
  pokemonCard.appendChild(pokemonName);

  // Añadir el evento de clic para mostrar los detalles en el main
  pokemonCard.addEventListener('click', async () => {
    const pokemonId = pokemonCard.dataset.pokemonId;
    const pokemon = await fetchPokemon(pokemonId);
    renderPokemonDetails(pokemon);
  });

  return pokemonCard;
};

// Función para mostrar mensaje de error
const showError = (message) => {
  const pokemonCardsContainer = document.getElementById('pokemon-cards');
  pokemonCardsContainer.innerHTML = `<p class="error-message">${message}</p>`;
};

// Función para cargar Pokémon en el footer según búsqueda o aleatoriamente
export const loadPokemonFooter = async (query = '') => {
  const pokemonCardsContainer = document.getElementById('pokemon-cards');
  pokemonCardsContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevos resultados

  if (query) {
    // Mostrar resultados de búsqueda
    const pokemon = await getPokemonByName(query);
    if (pokemon) {
      pokemonCardsContainer.appendChild(createPokemonCard(pokemon));
      renderPokemonDetails(pokemon); // Carga en el main 
    } else {
      showError('Pokémon no encontrado. Verifica la ortografía.');
    }
  } else {
    // Obtener y mostrar 4 Pokémon aleatorios
    for (let i = 0; i < 4; i++) {
      const pokemon = await getRandomPokemon();
      pokemonCardsContainer.appendChild(createPokemonCard(pokemon));
    }
  }
};

// Definir las clases de tipo para CSS
const typeClasses = {
  normal: 'type-normal',
  fire: 'type-fire',
  water: 'type-water',
  electric: 'type-electric',
  grass: 'type-grass',
  ice: 'type-ice',
  fighting: 'type-fighting',
  poison: 'type-poison',
  ground: 'type-ground',
  flying: 'type-flying',
  psychic: 'type-psychic',
  bug: 'type-bug',
  rock: 'type-rock',
  ghost: 'type-ghost',
  dragon: 'type-dragon',
  dark: 'type-dark',
  steel: 'type-steel',
  fairy: 'type-fairy'
};

// Función para obtener la clase CSS del tipo de Pokémon
const getTypeClass = (type) => {
  return typeClasses[type] || 'type-unknown'; // Devuelve 'type-unknown' si no se encuentra el tipo
};
