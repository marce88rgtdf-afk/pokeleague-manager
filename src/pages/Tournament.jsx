import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  Container,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

import {
  getPlayers,
  getTournaments,
  saveTournaments,
} from "../services/storage";

/**
 * Calcula la cantidad recomendada de rondas
 * según la cantidad de jugadores.
 *
 * 4 jugadores        -> 3 rondas
 * 5 a 8 jugadores    -> 4 rondas
 * 9 a 16 jugadores   -> 5 rondas
 * 17 a 32 jugadores  -> 6 rondas
 * 33 a 64 jugadores  -> 7 rondas
 * 65 a 128 jugadores -> 8 rondas
 */
function getRecommendedRounds(playerCount) {
  if (playerCount <= 4) {
    return 3;
  }

  if (playerCount <= 8) {
    return 4;
  }

  if (playerCount <= 16) {
    return 5;
  }

  if (playerCount <= 32) {
    return 6;
  }

  if (playerCount <= 64) {
    return 7;
  }

  return 8;
}

export default function Tournament() {
  const [players] = useState(getPlayers());

  const [name, setName] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [format, setFormat] = useState("Standard");

  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const [totalRounds, setTotalRounds] = useState(4);

  /**
   * Cambiar jugador seleccionado.
   */
  const togglePlayer = (id) => {
    setSelectedPlayers((current) =>
      current.includes(id)
        ? current.filter(
            (playerId) => playerId !== id
          )
        : [...current, id]
    );
  };

  /**
   * Cuando cambia la cantidad de jugadores,
   * actualizamos automáticamente la cantidad
   * recomendada de rondas.
   */
  const handlePlayerSelection = (id) => {
    setSelectedPlayers((current) => {
      const newSelection = current.includes(id)
        ? current.filter(
            (playerId) => playerId !== id
          )
        : [...current, id];

      const recommendedRounds =
        getRecommendedRounds(
          newSelection.length
        );

      setTotalRounds(recommendedRounds);

      return newSelection;
    });
  };

  /**
   * Crear torneo.
   */
  const createTournament = () => {
    if (!name.trim()) {
      alert(
        "Ingresá un nombre para el torneo."
      );
      return;
    }

    if (selectedPlayers.length < 2) {
      alert(
        "Seleccioná al menos 2 jugadores."
      );
      return;
    }

    if (totalRounds < 1) {
      alert(
        "La cantidad de rondas debe ser mayor a 0."
      );
      return;
    }

    const tournament = {
      id: crypto.randomUUID(),

      name: name.trim(),

      date,

      format,

      playerIds: selectedPlayers,

      totalRounds,

      createdAt:
        new Date().toISOString(),
    };

    const tournaments =
      getTournaments();

    const updatedTournaments = [
      ...tournaments,
      tournament,
    ];

    saveTournaments(
      updatedTournaments
    );

    console.log(
      "Torneo guardado:",
      tournament
    );

    alert(
      `Torneo "${tournament.name}" creado correctamente con ${selectedPlayers.length} jugadores y ${totalRounds} rondas.`
    );

    /**
     * Limpiamos el formulario después
     * de crear el torneo.
     */
    setName("");

    setSelectedPlayers([]);

    setTotalRounds(4);
  };

  return (
    <Container
      sx={{
        mt: 4,
        mb: 4,
      }}
    >
      {/* VOLVER AL DASHBOARD */}

      <Button
        component={Link}
        to="/"
        variant="outlined"
        sx={{ mb: 3 }}
      >
        ← Volver al Dashboard
      </Button>

      <Typography
        variant="h4"
        gutterBottom
      >
        🏆 Nuevo Torneo
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Configurá el torneo y
        seleccioná los participantes.
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* NOMBRE */}

            <TextField
              label="Nombre del torneo"
              placeholder="Ej: Liga Pokémon Río Grande #1"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              fullWidth
            />

            {/* FECHA */}

            <TextField
              label="Fecha"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(
                  event.target.value
                )
              }
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            {/* FORMATO */}

            <TextField
              select
              label="Formato"
              value={format}
              onChange={(event) =>
                setFormat(
                  event.target.value
                )
              }
              fullWidth
            >
              <MenuItem value="Standard">
                Standard
              </MenuItem>

              <MenuItem value="Expanded">
                Expanded
              </MenuItem>

              <MenuItem value="GLC">
                GLC
              </MenuItem>

              <MenuItem value="Unlimited">
                Unlimited
              </MenuItem>
            </TextField>

            {/* PARTICIPANTES */}

            <div>
              <Typography
                variant="h6"
                gutterBottom
              >
                👥 Participantes
              </Typography>

              {players.length === 0 ? (
                <Typography color="text.secondary">
                  No hay jugadores
                  registrados. Primero
                  agregá jugadores desde
                  la sección Jugadores.
                </Typography>
              ) : (
                <FormGroup>
                  {players.map(
                    (player) => (
                      <FormControlLabel
                        key={player.id}
                        control={
                          <Checkbox
                            checked={selectedPlayers.includes(
                              player.id
                            )}
                            onChange={() =>
                              handlePlayerSelection(
                                player.id
                              )
                            }
                          />
                        }
                        label={`${player.name} ${player.lastName} — ${player.category}`}
                      />
                    )
                  )}
                </FormGroup>
              )}
            </div>

            {/* CANTIDAD DE JUGADORES */}

            <Typography>
              <strong>
                {selectedPlayers.length}
              </strong>{" "}
              jugadores seleccionados
            </Typography>

            {/* RONDAS */}

            <TextField
              select
              label="Cantidad de rondas"
              value={totalRounds}
              onChange={(event) =>
                setTotalRounds(
                  Number(
                    event.target.value
                  )
                )
              }
              fullWidth
              helperText={`Cantidad recomendada para ${selectedPlayers.length} jugadores: ${getRecommendedRounds(
                selectedPlayers.length
              )} rondas`}
            >
              {Array.from(
                { length: 12 },
                (_, index) =>
                  index + 1
              ).map((rounds) => (
                <MenuItem
                  key={rounds}
                  value={rounds}
                >
                  {rounds}{" "}
                  {rounds === 1
                    ? "ronda"
                    : "rondas"}
                </MenuItem>
              ))}
            </TextField>

            {/* RESUMEN */}

            {selectedPlayers.length >=
              2 && (
              <Card
                variant="outlined"
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                  >
                    📋 Resumen
                  </Typography>

                  <Typography>
                    👥 Jugadores:{" "}
                    {
                      selectedPlayers.length
                    }
                  </Typography>

                  <Typography>
                    🎲 Rondas:{" "}
                    {totalRounds}
                  </Typography>

                  <Typography>
                    🎮 Formato:{" "}
                    {format}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* CREAR */}

            <Button
              variant="contained"
              size="large"
              onClick={
                createTournament
              }
              disabled={
                selectedPlayers.length <
                2
              }
            >
              🏆 Crear torneo
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}