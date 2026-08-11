// Motor de emparejamientos Swiss para PokéLeague Manager

/**
 * Calcula los puntos de un jugador a partir de todas las rondas.
 *
 * Victoria = 3 puntos
 * Empate   = 1 punto
 * Derrota  = 0 puntos
 * BYE      = 3 puntos
 */
export function calculatePlayerPoints(
  playerId,
  rounds = []
) {
  let points = 0;

  rounds.forEach((round) => {
    round.matches?.forEach((match) => {
      if (match.player1Id === playerId) {
        if (match.result === "PLAYER1_WIN") {
          points += 3;
        }

        if (match.result === "DRAW") {
          points += 1;
        }
      }

      if (match.player2Id === playerId) {
        if (match.result === "PLAYER2_WIN") {
          points += 3;
        }

        if (match.result === "DRAW") {
          points += 1;
        }
      }
    });

    if (round.bye?.playerId === playerId) {
      points += 3;
    }
  });

  return points;
}

/**
 * Devuelve todos los rivales que un jugador
 * ya enfrentó durante el torneo.
 */
export function getPreviousOpponents(
  playerId,
  rounds = []
) {
  const opponents = [];

  rounds.forEach((round) => {
    round.matches?.forEach((match) => {
      if (match.player1Id === playerId) {
        opponents.push(match.player2Id);
      }

      if (match.player2Id === playerId) {
        opponents.push(match.player1Id);
      }
    });
  });

  return opponents;
}

/**
 * Comprueba si dos jugadores ya se enfrentaron.
 */
export function havePlayedBefore(
  player1Id,
  player2Id,
  rounds = []
) {
  const player1Opponents = getPreviousOpponents(
    player1Id,
    rounds
  );

  return player1Opponents.includes(player2Id);
}

/**
 * Crea la información necesaria para realizar
 * los emparejamientos.
 */
export function buildPlayerStandings(
  players,
  rounds = []
) {
  return players
    .map((player) => ({
      playerId: player.id,
      name: `${player.name} ${player.lastName}`,
      points: calculatePlayerPoints(
        player.id,
        rounds
      ),
      previousOpponents: getPreviousOpponents(
        player.id,
        rounds
      ),
    }))
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      return a.name.localeCompare(b.name);
    });
}

/**
 * Busca un rival que:
 *
 * 1. Tenga la misma cantidad de puntos.
 * 2. No haya enfrentado anteriormente al jugador.
 *
 * Si no encuentra uno, posteriormente podremos
 * implementar una lógica de "float" hacia otro grupo.
 */
function findOpponent(
  player,
  candidates,
  rounds
) {
  for (const candidate of candidates) {
    if (
      !havePlayedBefore(
        player.playerId,
        candidate.playerId,
        rounds
      )
    ) {
      return candidate;
    }
  }

  return null;
}

/**
 * Genera los emparejamientos de una nueva ronda.
 *
 * Esta primera versión:
 *
 * - Agrupa jugadores por puntos.
 * - Intenta emparejar jugadores con los mismos puntos.
 * - Evita repetir rivales.
 * - Si no puede evitar una repetición, busca otro grupo.
 * - Asigna BYE cuando hay cantidad impar.
 */
export function generateNextRound(
  players,
  rounds = []
) {
  if (!players || players.length === 0) {
    return {
      matches: [],
      bye: null,
    };
  }

  const standings = buildPlayerStandings(
    players,
    rounds
  );

  const remaining = [...standings];

  const matches = [];

  let bye = null;

  // --------------------------------------------------
  // BYE
  // --------------------------------------------------

  if (remaining.length % 2 !== 0) {
    /*
     * Buscamos primero un jugador que todavía
     * no haya recibido BYE.
     *
     * Preferimos al jugador con menos puntos.
     */
    const byeCandidates = [...remaining]
      .reverse()
      .filter((player) => {
        return !rounds.some(
          (round) =>
            round.bye?.playerId === player.playerId
        );
      });

    const byePlayer =
      byeCandidates[0] ||
      remaining[remaining.length - 1];

    bye = {
      playerId: byePlayer.playerId,
      result: "BYE",
      points: 3,
    };

    const byeIndex = remaining.findIndex(
      (player) =>
        player.playerId === byePlayer.playerId
    );

    remaining.splice(byeIndex, 1);
  }

  // --------------------------------------------------
  // EMPAREJAMIENTO POR PUNTOS
  // --------------------------------------------------

  const groups = {};

  remaining.forEach((player) => {
    if (!groups[player.points]) {
      groups[player.points] = [];
    }

    groups[player.points].push(player);
  });

  const sortedPoints = Object.keys(groups)
    .map(Number)
    .sort((a, b) => b - a);

  let tableNumber = 1;

  // --------------------------------------------------
  // PRIMERA PASADA
  // Intentar emparejar dentro del mismo grupo
  // --------------------------------------------------

  sortedPoints.forEach((points) => {
    const group = groups[points];

    while (group.length >= 2) {
      const player = group.shift();

      const opponent = findOpponent(
        player,
        group,
        rounds
      );

      if (opponent) {
        const opponentIndex = group.findIndex(
          (candidate) =>
            candidate.playerId ===
            opponent.playerId
        );

        group.splice(opponentIndex, 1);

        matches.push({
          id: crypto.randomUUID(),
          table: tableNumber,
          player1Id: player.playerId,
          player2Id: opponent.playerId,
          result: null,
        });

        tableNumber++;
      } else {
        /*
         * No encontramos rival dentro del mismo
         * grupo de puntos.
         *
         * Lo devolvemos temporalmente para
         * emparejarlo con otro grupo.
         */
        group.unshift(player);
        break;
      }
    }
  });

  // --------------------------------------------------
  // SEGUNDA PASADA
  // Emparejar jugadores que quedaron sin rival
  // --------------------------------------------------

  const leftovers = [];

  sortedPoints.forEach((points) => {
    groups[points].forEach((player) => {
      leftovers.push(player);
    });
  });

  while (leftovers.length >= 2) {
    const player = leftovers.shift();

    let opponentIndex = leftovers.findIndex(
      (candidate) =>
        !havePlayedBefore(
          player.playerId,
          candidate.playerId,
          rounds
        )
    );

    /*
     * Si no encontramos rival nuevo,
     * permitimos una repetición como último recurso.
     *
     * Esto se puede mejorar posteriormente
     * con reglas más avanzadas.
     */
    if (opponentIndex === -1) {
      opponentIndex = 0;
    }

    const opponent = leftovers.splice(
      opponentIndex,
      1
    )[0];

    matches.push({
      id: crypto.randomUUID(),
      table: tableNumber,
      player1Id: player.playerId,
      player2Id: opponent.playerId,
      result: null,
    });

    tableNumber++;
  }

  return {
    matches,
    bye,
  };
}