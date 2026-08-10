const PLAYERS_KEY = "pokeleague_players";

export function getPlayers() {
  const players = localStorage.getItem(PLAYERS_KEY);

  if (!players) {
    return [];
  }

  try {
    return JSON.parse(players);
  } catch (error) {
    console.error("Error al cargar jugadores:", error);
    return [];
  }
}

export function savePlayers(players) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function clearPlayers() {
  localStorage.removeItem(PLAYERS_KEY);
}