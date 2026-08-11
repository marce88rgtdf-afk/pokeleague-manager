import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  getPlayers,
  getTournaments,
  saveTournaments,
} from "../services/storage";

export default function Tournament() {
  const [players] = useState(getPlayers());

  const [name, setName] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [format, setFormat] = useState("Standard");
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const togglePlayer = (id) => {
    setSelectedPlayers((current) =>
      current.includes(id)
        ? current.filter((playerId) => playerId !== id)
        : [...current, id]
    );
  };

  const createTournament = () => {
    if (!name.trim()) {
      alert("Ingresá un nombre para el torneo.");
      return;
    }

    if (selectedPlayers.length < 2) {
      alert("Seleccioná al menos 2 jugadores.");
      return;
    }

    const tournament = {
      id: crypto.randomUUID(),
      name: name.trim(),
      date,
      format,
      playerIds: selectedPlayers,
      createdAt: new Date().toISOString(),
    };

    const tournaments = getTournaments();

const updatedTournaments = [
  ...tournaments,
  tournament,
];

saveTournaments(updatedTournaments);

console.log("Torneo guardado:", tournament);

alert(
  `Torneo "${tournament.name}" creado correctamente con ${selectedPlayers.length} jugadores.`
);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        🏆 Nuevo Torneo
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Configurá el torneo y seleccioná los participantes.
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Nombre del torneo"
              placeholder="Ej: Liga Pokémon Río Grande #1"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />

            <TextField
              label="Fecha"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              select
              label="Formato"
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              fullWidth
            >
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Expanded">Expanded</MenuItem>
              <MenuItem value="GLC">GLC</MenuItem>
              <MenuItem value="Unlimited">Unlimited</MenuItem>
            </TextField>

            <div>
              <Typography variant="h6" gutterBottom>
                👥 Participantes
              </Typography>

              {players.length === 0 ? (
                <Typography color="text.secondary">
                  No hay jugadores registrados. Primero agregá jugadores
                  desde la sección Jugadores.
                </Typography>
              ) : (
                <FormGroup>
                  {players.map((player) => (
                    <FormControlLabel
                      key={player.id}
                      control={
                        <Checkbox
                          checked={selectedPlayers.includes(player.id)}
                          onChange={() => togglePlayer(player.id)}
                        />
                      }
                      label={`${player.name} ${player.lastName} — ${player.category}`}
                    />
                  ))}
                </FormGroup>
              )}
            </div>

            <Typography>
              <strong>{selectedPlayers.length}</strong>{" "}
              jugadores seleccionados
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={createTournament}
              disabled={selectedPlayers.length < 2}
            >
              🏆 Crear torneo
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}