// Motor de emparejamientos Swiss para PokéLeague Manager
// v0.3.7
//
// Reglas:
// - Victoria = 3 puntos
// - Empate = 1 punto
// - Derrota = 0 puntos
// - BYE = 3 puntos
//
// Objetivos:
// - Emparejar primero por cantidad de puntos.
// - Evitar repetir rivales.
// - Hacer "float" entre grupos de puntuación cuando sea necesario.
// - Evitar repetir BYE.
// - Mantener un orden estable de emparejamientos.
// - No modificar rondas anteriores.

/**
 * ==========================================================
 * PUNTOS
 * ==========================================================
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
 * ==========================================================
 * HISTORIAL DE RIVALES
 * ==========================================================
 */

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
      if (
        match.player1Id === playerId &&
        match.player2Id
      ) {
        opponents.push(match.player2Id);
      }

      if (
        match.player2Id === playerId &&
        match.player1Id
      ) {
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
  return getPreviousOpponents(
    player1Id,
    rounds
  ).includes(player2Id);
}

/**
 * ==========================================================
 * BYE
 * ==========================================================
 */

/**
 * Comprueba si el jugador ya recibió un BYE.
 */
function hasReceivedBye(
  playerId,
  rounds = []
) {
  return rounds.some(
    (round) =>
      round.bye?.playerId === playerId
  );
}

/**
 * ==========================================================
 * STANDINGS PARA EL EMPAREJAMIENTO
 * ==========================================================
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

      previousOpponents:
        getPreviousOpponents(
          player.id,
          rounds
        ),

      hasBye: hasReceivedBye(
        player.id,
        rounds
      ),
    }))
    .sort((a, b) => {
      /*
       * Primero puntos.
       */
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      /*
       * Luego nombre para mantener
       * un orden determinístico.
       */
      return a.name.localeCompare(
        b.name
      );
    });
}

/**
 * ==========================================================
 * UTILIDADES
 * ==========================================================
 */

/**
 * Devuelve true si existe al menos
 * un rival válido para el jugador.
 */
function hasValidOpponent(
  player,
  candidates,
  rounds
) {
  return candidates.some(
    (candidate) =>
      candidate.playerId !==
        player.playerId &&
      !havePlayedBefore(
        player.playerId,
        candidate.playerId,
        rounds
      )
  );
}

/**
 * Busca el mejor rival posible.
 *
 * Se prioriza:
 * 1. No haber jugado anteriormente.
 * 2. Menor diferencia de puntos.
 * 3. Orden alfabético estable.
 */
function findBestOpponent(
  player,
  candidates,
  rounds
) {
  const validCandidates =
    candidates.filter(
      (candidate) =>
        candidate.playerId !==
          player.playerId &&
        !havePlayedBefore(
          player.playerId,
          candidate.playerId,
          rounds
        )
    );

  if (
    validCandidates.length === 0
  ) {
    return null;
  }

  return [...validCandidates].sort(
    (a, b) => {
      const pointDifferenceA =
        Math.abs(
          player.points -
            a.points
        );

      const pointDifferenceB =
        Math.abs(
          player.points -
            b.points
        );

      if (
        pointDifferenceA !==
        pointDifferenceB
      ) {
        return (
          pointDifferenceA -
          pointDifferenceB
        );
      }

      return a.name.localeCompare(
        b.name
      );
    }
  )[0];
}

/**
 * ==========================================================
 * GENERACIÓN DEL BYE
 * ==========================================================
 */

/**
 * Selecciona el jugador que recibirá BYE.
 *
 * Prioridad:
 * 1. No haber recibido BYE.
 * 2. Menor cantidad de puntos.
 * 3. Orden alfabético estable.
 */
function selectByePlayer(
  players,
  rounds
) {
  const candidates =
    players.filter(
      (player) =>
        !hasReceivedBye(
          player.playerId,
          rounds
        )
    );

  /*
   * Si todavía existen jugadores
   * sin BYE, usamos solamente esos.
   */
  const pool =
    candidates.length > 0
      ? candidates
      : players;

  return [...pool].sort(
    (a, b) => {
      if (
        a.points !== b.points
      ) {
        return (
          a.points - b.points
        );
      }

      return a.name.localeCompare(
        b.name
      );
    }
  )[0];
}

/**
 * ==========================================================
 * AGRUPAR POR PUNTOS
 * ==========================================================
 */

function groupByPoints(
  players
) {
  const groups = new Map();

  players.forEach((player) => {
    if (!groups.has(player.points)) {
      groups.set(
        player.points,
        []
      );
    }

    groups
      .get(player.points)
      .push(player);
  });

  return groups;
}

/**
 * ==========================================================
 * CREAR MATCH
 * ==========================================================
 */

function createMatch(
  player1,
  player2,
  table
) {
  return {
    id: crypto.randomUUID(),

    table,

    player1Id:
      player1.playerId,

    player2Id:
      player2.playerId,

    result: null,

    player1Points: 0,

    player2Points: 0,
  };
}

/**
 * ==========================================================
 * EMPAREJAR DENTRO DE UN GRUPO
 * ==========================================================
 */

/**
 * Intenta emparejar todos los jugadores
 * posibles dentro de un grupo.
 *
 * Devuelve:
 * - matches
 * - leftovers
 */
function pairGroup(
  group,
  rounds,
  tableNumber
) {
  const remaining = [
    ...group,
  ];

  const matches = [];

  let table =
    tableNumber;

  while (
    remaining.length >= 2
  ) {
    const player =
      remaining.shift();

    const opponent =
      findBestOpponent(
        player,
        remaining,
        rounds
      );

    if (!opponent) {
      /*
       * No encontramos rival dentro
       * del grupo.
       *
       * El jugador queda para hacer
       * float hacia otro grupo.
       */
      return {
        matches,
        leftovers: [
          player,
          ...remaining,
        ],
        nextTable: table,
      };
    }

    const opponentIndex =
      remaining.findIndex(
        (candidate) =>
          candidate.playerId ===
          opponent.playerId
      );

    remaining.splice(
      opponentIndex,
      1
    );

    matches.push(
      createMatch(
        player,
        opponent,
        table
      )
    );

    table++;
  }

  return {
    matches,
    leftovers: remaining,
    nextTable: table,
  };
}

/**
 * ==========================================================
 * FLOAT
 * ==========================================================
 */

/**
 * Intenta colocar un jugador que quedó
 * sin rival en el siguiente grupo.
 *
 * Primero busca un rival que:
 * - no haya enfrentado anteriormente;
 * - tenga la menor diferencia de puntos.
 */
function findFloatOpponent(
  player,
  lowerGroups,
  rounds
) {
  const candidates = [];

  lowerGroups.forEach(
    (group) => {
      group.forEach(
        (candidate) => {
          if (
            candidate.playerId !==
              player.playerId &&
            !havePlayedBefore(
              player.playerId,
              candidate.playerId,
              rounds
            )
          ) {
            candidates.push(
              candidate
            );
          }
        }
      );
    }
  );

  if (
    candidates.length === 0
  ) {
    return null;
  }

  return [...candidates].sort(
    (a, b) => {
      const diffA =
        Math.abs(
          player.points -
            a.points
        );

      const diffB =
        Math.abs(
          player.points -
            b.points
        );

      if (diffA !== diffB) {
        return diffA - diffB;
      }

      return a.name.localeCompare(
        b.name
      );
    }
  )[0];
}

/**
 * ==========================================================
 * GENERAR SIGUIENTE RONDA
 * ==========================================================
 */

export function generateNextRound(
  players,
  rounds = []
) {
  if (
    !players ||
    players.length === 0
  ) {
    return {
      matches: [],
      bye: null,
    };
  }

  /*
   * Construimos el estado actual
   * de todos los jugadores.
   */
  const standings =
    buildPlayerStandings(
      players,
      rounds
    );

  let remaining = [
    ...standings,
  ];

  const matches = [];

  let bye = null;

  let tableNumber = 1;

  /*
   * ======================================================
   * BYE
   * ======================================================
   */

  if (
    remaining.length % 2 !==
    0
  ) {
    const byePlayer =
      selectByePlayer(
        remaining,
        rounds
      );

    if (byePlayer) {
      bye = {
        playerId:
          byePlayer.playerId,

        result: "BYE",

        points: 3,
      };

      remaining =
        remaining.filter(
          (player) =>
            player.playerId !==
            byePlayer.playerId
        );
    }
  }

  /*
   * ======================================================
   * GRUPOS DE PUNTOS
   * ======================================================
   */

  const groups =
    groupByPoints(
      remaining
    );

  const sortedPoints =
    [...groups.keys()].sort(
      (a, b) => b - a
    );

  /*
   * ======================================================
   * PRIMERA PASADA
   *
   * Intentamos resolver cada grupo
   * utilizando solamente jugadores
   * con la misma puntuación.
   * ======================================================
   */

  const leftovers = [];

  sortedPoints.forEach(
    (points) => {
      const group =
        groups.get(points);

      if (
        !group ||
        group.length === 0
      ) {
        return;
      }

      const result =
        pairGroup(
          group,
          rounds,
          tableNumber
        );

      matches.push(
        ...result.matches
      );

      tableNumber =
        result.nextTable;

      leftovers.push(
        ...result.leftovers
      );
    }
  );

  /*
   * ======================================================
   * SEGUNDA PASADA
   *
   * Los jugadores que quedaron sin
   * rival intentan hacer FLOAT hacia
   * otro grupo.
   * ======================================================
   */

  const unpaired =
    [...leftovers];

  const pairedIds =
    new Set();

  /*
   * Primero registramos jugadores
   * que ya fueron emparejados.
   */
  matches.forEach(
    (match) => {
      pairedIds.add(
        match.player1Id
      );

      pairedIds.add(
        match.player2Id
      );
    }
  );

  /*
   * Solamente quedan aquí jugadores
   * que todavía no tienen rival.
   */
  let floatingPlayers =
    unpaired.filter(
      (player) =>
        !pairedIds.has(
          player.playerId
        )
    );

  /*
   * Ordenamos de mayor a menor
   * puntuación para que el float
   * sea controlado.
   */
  floatingPlayers.sort(
    (a, b) => {
      if (
        b.points !== a.points
      ) {
        return (
          b.points -
          a.points
        );
      }

      return a.name.localeCompare(
        b.name
      );
    }
  );

  /*
   * ======================================================
   * TERCERA PASADA
   *
   * Emparejamos los leftovers
   * buscando primero rivales nuevos.
   * ======================================================
   */

  while (
    floatingPlayers.length >=
    2
  ) {
    const player =
      floatingPlayers.shift();

    let opponentIndex =
      floatingPlayers.findIndex(
        (candidate) =>
          !havePlayedBefore(
            player.playerId,
            candidate.playerId,
            rounds
          )
      );

    /*
     * Si no encontramos rival nuevo
     * directamente en leftovers,
     * buscamos en todos los jugadores
     * todavía no emparejados.
     */
    if (
      opponentIndex === -1
    ) {
      const candidate =
        findFloatOpponent(
          player,
          sortedPoints
            .map((points) =>
              groups.get(points)
            )
            .filter(Boolean),
          rounds
        );

      if (candidate) {
        const candidateIndex =
          floatingPlayers.findIndex(
            (item) =>
              item.playerId ===
              candidate.playerId
          );

        if (
          candidateIndex !==
          -1
        ) {
          opponentIndex =
            candidateIndex;
        }
      }
    }

    /*
     * Si todavía no existe un rival
     * nuevo, dejamos constancia del
     * problema y buscamos el mejor
     * rival disponible.
     *
     * Esto es un último recurso.
     */
    if (
      opponentIndex === -1
    ) {
      opponentIndex =
        floatingPlayers.findIndex(
          (candidate) =>
            candidate.playerId !==
            player.playerId
        );
    }

    if (
      opponentIndex === -1
    ) {
      /*
       * No hay nadie disponible.
       */
      floatingPlayers.unshift(
        player
      );

      break;
    }

    const opponent =
      floatingPlayers.splice(
        opponentIndex,
        1
      )[0];

    matches.push(
      createMatch(
        player,
        opponent,
        tableNumber
      )
    );

    tableNumber++;
  }

  /*
   * ======================================================
   * VERIFICACIÓN FINAL
   * ======================================================
   */

  const matchedIds =
    new Set();

  matches.forEach(
    (match) => {
      matchedIds.add(
        match.player1Id
      );

      matchedIds.add(
        match.player2Id
      );
    }
  );

  /*
   * Si por alguna razón quedó
   * exactamente un jugador sin
   * emparejar y todavía no tiene BYE,
   * lo convertimos en BYE.
   *
   * Normalmente esto solamente debería
   * ocurrir por una situación extrema.
   */
  const unmatched =
    remaining.filter(
      (player) =>
        !matchedIds.has(
          player.playerId
        ) &&
        player.playerId !==
          bye?.playerId
    );

  if (
    unmatched.length === 1 &&
    !bye
  ) {
    const byePlayer =
      unmatched[0];

    bye = {
      playerId:
        byePlayer.playerId,

      result: "BYE",

      points: 3,
    };
  }

  /*
   * ======================================================
   * RESULTADO
   * ======================================================
   */

  return {
    matches,
    bye,
  };
}