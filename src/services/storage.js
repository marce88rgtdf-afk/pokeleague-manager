const PLAYERS_KEY = "pokeleague_players";
const TOURNAMENTS_KEY = "pokeleague_tournaments";

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
  localStorage.setItem(
    PLAYERS_KEY,
    JSON.stringify(players)
  );
}

export function clearPlayers() {
  localStorage.removeItem(PLAYERS_KEY);
}

export function getTournaments() {
  const tournaments = localStorage.getItem(TOURNAMENTS_KEY);

  if (!tournaments) {
    return [];
  }

  try {
    return JSON.parse(tournaments);
  } catch (error) {
    console.error("Error al cargar torneos:", error);
    return [];
  }
}

export function saveTournaments(tournaments) {
  localStorage.setItem(
    TOURNAMENTS_KEY,
    JSON.stringify(tournaments)
  );
}

export function clearTournaments() {
  localStorage.removeItem(TOURNAMENTS_KEY);
}