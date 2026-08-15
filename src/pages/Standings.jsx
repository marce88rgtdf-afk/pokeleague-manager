import { useMemo } from "react";

import {
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  getTournaments,
  getPlayers,
} from "../services/storage";

import {
  calculatePlayerPoints,
} from "../services/swiss";

import BackToDashboard from "../components/BackToDashboard";

export default function Standings() {
  const tournaments = getTournaments();
  const players = getPlayers();

  /*
   * ==================================================
   * CALCULAR RANKING
   * ==================================================
   */

  const standings = useMemo(() => {
    const ranking = players.map((player) => {
      let points = 0;
      let wins = 0;
      let draws = 0;
      let losses = 0;
      let byes = 0;

      tournaments.forEach((tournament) => {
        /*
         * Solo contamos al jugador si participa
         * en este torneo.
         */
        if (
          !tournament.playerIds?.includes(
            player.id
          )
        ) {
          return;
        }

        const rounds =
          tournament.rounds || [];

        /*
         * Puntos
         */
        points += calculatePlayerPoints(
          player.id,
          rounds
        );

        /*
         * Resultados
         */
        rounds.forEach((round) => {
          round.matches?.forEach(
            (match) => {
              if (
                match.player1Id !== player.id &&
                match.player2Id !== player.id
              ) {
                return;
              }

              if (
                match.result === "DRAW"
              ) {
                draws++;
                return;
              }

              if (
                match.result ===
                "PLAYER1_WIN"
              ) {
                if (
                  match.player1Id ===
                  player.id
                ) {
                  wins++;
                } else {
                  losses++;
                }

                return;
              }

              if (
                match.result ===
                "PLAYER2_WIN"
              ) {
                if (
                  match.player2Id ===
                  player.id
                ) {
                  wins++;
                } else {
                  losses++;
                }
              }
            }
          );

          /*
           * BYE
           */
          if (
            round.bye?.playerId ===
            player.id
          ) {
            byes++;
          }
        });
      });

      return {
        playerId: player.id,
        name: `${player.name} ${player.lastName}`,
        category: player.category || "",
        points,
        wins,
        draws,
        losses,
        byes,
      };
    });

    /*
     * ==================================================
     * ORDEN DEL RANKING
     * ==================================================
     *
     * 1. Puntos
     * 2. Victorias
     * 3. Diferencia V-D
     * 4. Nombre
     */

    return ranking
      .filter(
        (player) =>
          player.points > 0 ||
          player.wins > 0 ||
          player.draws > 0 ||
          player.losses > 0 ||
          player.byes > 0
      )
      .sort((a, b) => {
        if (
          b.points !== a.points
        ) {
          return (
            b.points -
            a.points
          );
        }

        if (
          b.wins !== a.wins
        ) {
          return (
            b.wins -
            a.wins
          );
        }

        const scoreA =
          a.wins -
          a.losses;

        const scoreB =
          b.wins -
          b.losses;

        if (
          scoreB !== scoreA
        ) {
          return (
            scoreB -
            scoreA
          );
        }

        return a.name.localeCompare(
          b.name
        );
      });
  }, [players, tournaments]);

  /*
   * ==================================================
   * POSICIÓN
   * ==================================================
   */

  const getPositionDisplay = (
    position
  ) => {
    if (position === 1) {
      return "🥇";
    }

    if (position === 2) {
      return "🥈";
    }

    if (position === 3) {
      return "🥉";
    }

    return position;
  };

  /*
   * ==================================================
   * INTERFAZ
   * ==================================================
   */

  return (
    <Container
      sx={{
        mt: 4,
        mb: 4,
      }}
    >
      {/* BOTÓN VOLVER AL DASHBOARD */}

      <BackToDashboard />

      <Typography
        variant="h4"
        gutterBottom
      >
        🏆 Ranking
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Clasificación general de jugadores.
      </Typography>

      <Card>
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
          >
            🏆 Tabla de posiciones
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Ranking ordenado por puntos,
            victorias y diferencia de resultados.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {standings.length === 0 ? (
            <Stack
              alignItems="center"
              sx={{ py: 5 }}
            >
              <Typography
                color="text.secondary"
              >
                Todavía no hay resultados
                para mostrar.
              </Typography>
            </Stack>
          ) : (
            <TableContainer>
              <Table
                sx={{
                  minWidth: 750,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Pos.
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Jugador
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Categoría
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      🏆 Pts
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      V
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      E
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      D
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      ⭐ BYE
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {standings.map(
                    (
                      player,
                      index
                    ) => {
                      const position =
                        index + 1;

                      return (
                        <TableRow
                          key={
                            player.playerId
                          }
                          hover
                        >
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight:
                                position <=
                                3
                                  ? "bold"
                                  : "normal",
                              fontSize:
                                position <=
                                3
                                  ? "1.1rem"
                                  : "1rem",
                            }}
                          >
                            {getPositionDisplay(
                              position
                            )}
                          </TableCell>

                          <TableCell>
                            <Typography
                              fontWeight="bold"
                            >
                              {
                                player.name
                              }
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {
                              player.category
                            }
                          </TableCell>

                          <TableCell
                            align="center"
                          >
                            <Typography
                              fontWeight="bold"
                            >
                              {
                                player.points
                              }
                            </Typography>
                          </TableCell>

                          <TableCell
                            align="center"
                          >
                            {
                              player.wins
                            }
                          </TableCell>

                          <TableCell
                            align="center"
                          >
                            {
                              player.draws
                            }
                          </TableCell>

                          <TableCell
                            align="center"
                          >
                            {
                              player.losses
                            }
                          </TableCell>

                          <TableCell
                            align="center"
                          >
                            {
                              player.byes
                            }
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}