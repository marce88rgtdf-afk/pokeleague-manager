import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useParams, Link } from "react-router-dom";

import {
  getTournaments,
  getPlayers,
  saveTournaments,
} from "../services/storage";

import { generateNextRound } from "../services/swiss";

export default function TournamentDetail() {
  const { tournamentId } = useParams();

  const [tournaments, setTournaments] = useState(
    getTournaments()
  );

  const players = getPlayers();

  const tournament = tournaments.find(
    (item) => item.id === tournamentId
  );

  if (!tournament) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          ❌ Torneo no encontrado
        </Typography>

        <Button
          component={Link}
          to="/my-tournaments"
          variant="contained"
        >
          Volver a Mis Torneos
        </Button>
      </Container>
    );
  }

  const tournamentPlayers = players.filter((player) =>
    tournament.playerIds.includes(player.id)
  );

  const rounds = tournament.rounds || [];

  const getPlayerName = (playerId) => {
    const player = players.find(
      (item) => item.id === playerId
    );

    if (!player) {
      return "Jugador desconocido";
    }

    return `${player.name} ${player.lastName}`;
  };

  // --------------------------------------------------
  // GENERAR RONDA 1
  // --------------------------------------------------

  const generateRoundOne = () => {
    if (rounds.length > 0) {
      alert("La Ronda 1 ya fue generada.");
      return;
    }

    const newRoundData = generateNextRound(
      tournamentPlayers,
      []
    );

    const round = {
      number: 1,
      matches: newRoundData.matches,
      bye: newRoundData.bye,
      createdAt: new Date().toISOString(),
    };

    const updatedTournament = {
      ...tournament,
      rounds: [round],
    };

    const updatedTournaments = tournaments.map((item) =>
      item.id === tournament.id
        ? updatedTournament
        : item
    );

    saveTournaments(updatedTournaments);
    setTournaments(updatedTournaments);

    alert("Ronda 1 generada correctamente.");
  };

  // --------------------------------------------------
  // GENERAR SIGUIENTE RONDA
  // --------------------------------------------------

  const generateNextTournamentRound = () => {
    if (rounds.length === 0) {
      alert("Primero tenés que generar la Ronda 1.");
      return;
    }

    const currentRound = rounds[rounds.length - 1];

    const pendingResults = currentRound.matches.some(
      (match) => !match.result
    );

    if (pendingResults) {
      alert(
        "No podés generar la siguiente ronda porque todavía hay resultados pendientes."
      );

      return;
    }

    const newRoundData = generateNextRound(
      tournamentPlayers,
      rounds
    );

    const newRound = {
      number: rounds.length + 1,
      matches: newRoundData.matches,
      bye: newRoundData.bye,
      createdAt: new Date().toISOString(),
    };

    const updatedTournament = {
      ...tournament,
      rounds: [...rounds, newRound],
    };

    const updatedTournaments = tournaments.map((item) =>
      item.id === tournament.id
        ? updatedTournament
        : item
    );

    saveTournaments(updatedTournaments);
    setTournaments(updatedTournaments);

    alert(
      `Ronda ${newRound.number} generada correctamente.`
    );
  };

  // --------------------------------------------------
  // GUARDAR RESULTADO
  // --------------------------------------------------

  const saveMatchResult = (matchId, result) => {
    const updatedRounds = rounds.map((round) => {
      const updatedMatches = round.matches.map((match) => {
        if (match.id !== matchId) {
          return match;
        }

        let player1Points = 0;
        let player2Points = 0;

        if (result === "PLAYER1_WIN") {
          player1Points = 3;
          player2Points = 0;
        }

        if (result === "DRAW") {
          player1Points = 1;
          player2Points = 1;
        }

        if (result === "PLAYER2_WIN") {
          player1Points = 0;
          player2Points = 3;
        }

        return {
          ...match,
          result,
          player1Points,
          player2Points,
        };
      });

      return {
        ...round,
        matches: updatedMatches,
      };
    });

    const updatedTournament = {
      ...tournament,
      rounds: updatedRounds,
    };

    const updatedTournaments = tournaments.map((item) =>
      item.id === tournament.id
        ? updatedTournament
        : item
    );

    saveTournaments(updatedTournaments);
    setTournaments(updatedTournaments);
  };

  // --------------------------------------------------
  // TEXTO DEL RESULTADO
  // --------------------------------------------------

  const getResultText = (match) => {
    if (!match.result) {
      return "Resultado pendiente";
    }

    if (match.result === "PLAYER1_WIN") {
      return `Victoria de ${getPlayerName(
        match.player1Id
      )}`;
    }

    if (match.result === "PLAYER2_WIN") {
      return `Victoria de ${getPlayerName(
        match.player2Id
      )}`;
    }

    if (match.result === "DRAW") {
      return "🤝 Empate";
    }

    return "Resultado pendiente";
  };

  // --------------------------------------------------
  // INTERFAZ
  // --------------------------------------------------

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        🏆 {tournament.name}
      </Typography>

      <Typography color="text.secondary">
        Fecha: {tournament.date}
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Formato: {tournament.format}
      </Typography>

      {/* PARTICIPANTES */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            👥 Participantes
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {tournamentPlayers.length} jugadores
          </Typography>

          <Stack spacing={1}>
            {tournamentPlayers.map((player) => (
              <Typography key={player.id}>
                👤 {player.name} {player.lastName} —{" "}
                {player.category}
              </Typography>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* RONDAS */}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎲 Rondas
          </Typography>

          {/* SIN RONDAS */}

          {rounds.length === 0 && (
            <>
              <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                El torneo todavía no tiene rondas
                generadas.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={generateRoundOne}
              >
                🎲 Generar Ronda 1
              </Button>
            </>
          )}

          {/* CON RONDAS */}

          {rounds.length > 0 && (
            <Stack spacing={3}>
              {rounds.map((round) => (
                <Card
                  key={round.number}
                  variant="outlined"
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                    >
                      Ronda {round.number}
                    </Typography>

                    <Stack spacing={3}>
                      {round.matches.map((match) => (
                        <Card
                          key={match.id}
                          variant="outlined"
                        >
                          <CardContent>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Mesa {match.table}
                            </Typography>

                            <Typography variant="h6">
                              {getPlayerName(
                                match.player1Id
                              )}
                            </Typography>

                            <Typography
                              sx={{
                                textAlign: "center",
                                my: 1,
                              }}
                            >
                              VS
                            </Typography>

                            <Typography variant="h6">
                              {getPlayerName(
                                match.player2Id
                              )}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography
                              sx={{ mb: 2 }}
                              fontWeight="bold"
                            >
                              {getResultText(match)}
                            </Typography>

                            <Stack
                              direction={{
                                xs: "column",
                                sm: "row",
                              }}
                              spacing={1}
                            >
                              <Button
                                variant={
                                  match.result ===
                                  "PLAYER1_WIN"
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() =>
                                  saveMatchResult(
                                    match.id,
                                    "PLAYER1_WIN"
                                  )
                                }
                              >
                                🟢 Gana{" "}
                                {getPlayerName(
                                  match.player1Id
                                )}
                              </Button>

                              <Button
                                variant={
                                  match.result === "DRAW"
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() =>
                                  saveMatchResult(
                                    match.id,
                                    "DRAW"
                                  )
                                }
                              >
                                🤝 Empate
                              </Button>

                              <Button
                                variant={
                                  match.result ===
                                  "PLAYER2_WIN"
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() =>
                                  saveMatchResult(
                                    match.id,
                                    "PLAYER2_WIN"
                                  )
                                }
                              >
                                🟢 Gana{" "}
                                {getPlayerName(
                                  match.player2Id
                                )}
                              </Button>
                            </Stack>

                            {match.result && (
                              <Typography
                                color="text.secondary"
                                sx={{ mt: 2 }}
                              >
                                Puntos:{" "}
                                {getPlayerName(
                                  match.player1Id
                                )}{" "}
                                {match.player1Points} —{" "}
                                {match.player2Points}{" "}
                                {getPlayerName(
                                  match.player2Id
                                )}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))}

                      {/* BYE */}

                      {round.bye && (
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6">
                              ⭐ BYE
                            </Typography>

                            <Typography>
                              {getPlayerName(
                                round.bye.playerId
                              )}
                            </Typography>

                            <Typography
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              3 puntos
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}

              {/* SIGUIENTE RONDA */}

              <Button
                variant="contained"
                size="large"
                onClick={generateNextTournamentRound}
              >
                🎲 Generar Ronda {rounds.length + 1}
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}