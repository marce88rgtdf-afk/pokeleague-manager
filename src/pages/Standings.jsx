import { useState } from "react";
import {
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { getTournaments, getPlayers } from "../services/storage";

export default function Standings() {
  const [tournaments] = useState(getTournaments());
  const [players] = useState(getPlayers());

  const [selectedTournamentId, setSelectedTournamentId] =
    useState(tournaments[0]?.id || "");

  const selectedTournament = tournaments.find(
    (tournament) => tournament.id === selectedTournamentId
  );

  const calculateStandings = () => {
    if (!selectedTournament) {
      return [];
    }

    const standings = selectedTournament.playerIds.map(
      (playerId) => {
        const player = players.find(
          (item) => item.id === playerId
        );

        return {
          playerId,
          name: player
            ? `${player.name} ${player.lastName}`
            : "Jugador desconocido",
          category: player?.category || "",
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          byes: 0,
        };
      }
    );

    const getStanding = (playerId) =>
      standings.find(
        (standing) => standing.playerId === playerId
      );

    const rounds = selectedTournament.rounds || [];

    rounds.forEach((round) => {
      round.matches.forEach((match) => {
        const player1 = getStanding(match.player1Id);
        const player2 = getStanding(match.player2Id);

        if (!player1 || !player2 || !match.result) {
          return;
        }

        if (match.result === "PLAYER1_WIN") {
          player1.points += 3;
          player1.wins += 1;
          player2.losses += 1;
        }

        if (match.result === "DRAW") {
          player1.points += 1;
          player2.points += 1;
          player1.draws += 1;
          player2.draws += 1;
        }

        if (match.result === "PLAYER2_WIN") {
          player2.points += 3;
          player2.wins += 1;
          player1.losses += 1;
        }
      });

      if (round.bye) {
        const byePlayer = getStanding(
          round.bye.playerId
        );

        if (byePlayer) {
          byePlayer.points += 3;
          byePlayer.byes += 1;
        }
      }
    });

    return standings.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      return a.name.localeCompare(b.name);
    });
  };

  const standings = calculateStandings();

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Ranking
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Clasificación automática según los resultados del
        torneo.
      </Typography>

      {tournaments.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Todavía no hay torneos creados.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <TextField
            select
            label="Seleccionar torneo"
            value={selectedTournamentId}
            onChange={(event) =>
              setSelectedTournamentId(event.target.value)
            }
            fullWidth
            sx={{ mb: 3 }}
          >
            {tournaments.map((tournament) => (
              <MenuItem
                key={tournament.id}
                value={tournament.id}
              >
                {tournament.name}
              </MenuItem>
            ))}
          </TextField>

          {selectedTournament && (
            <Card>
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                >
                  🏆 {selectedTournament.name}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Rondas jugadas:{" "}
                  {(selectedTournament.rounds || []).length}
                </Typography>

                <Stack spacing={1}>
                  {standings.map((player, index) => (
                    <Card
                      key={player.playerId}
                      variant="outlined"
                    >
                      <CardContent>
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <div>
                            <Typography variant="h6">
                              {index + 1}. {player.name}
                            </Typography>

                            <Typography
                              color="text.secondary"
                            >
                              {player.category}
                            </Typography>
                          </div>

                          <div>
                            <Typography variant="h6">
                              🏆 {player.points} pts
                            </Typography>

                            <Typography
                              color="text.secondary"
                            >
                              {player.wins}V ·{" "}
                              {player.draws}E ·{" "}
                              {player.losses}D
                            </Typography>

                            {player.byes > 0 && (
                              <Typography
                                color="text.secondary"
                              >
                                ⭐ BYE: {player.byes}
                              </Typography>
                            )}
                          </div>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}