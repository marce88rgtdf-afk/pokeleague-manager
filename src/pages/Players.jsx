import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { getPlayers, savePlayers } from "../services/storage";

export default function Players() {
  const [players, setPlayers] = useState(getPlayers());

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [category, setCategory] = useState("Master");
  const [playerId, setPlayerId] = useState("");

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const clearForm = () => {
    setName("");
    setLastName("");
    setCategory("Master");
    setPlayerId("");
    setEditingId(null);
  };

  const savePlayer = () => {
    if (!name.trim() || !lastName.trim()) {
      return;
    }

    if (editingId) {
      const updatedPlayers = players.map((player) =>
        player.id === editingId
          ? {
              ...player,
              name: name.trim(),
              lastName: lastName.trim(),
              category,
              playerId: playerId.trim(),
            }
          : player
      );

      setPlayers(updatedPlayers);
      savePlayers(updatedPlayers);
      clearForm();
      return;
    }

    const newPlayer = {
      id: crypto.randomUUID(),
      name: name.trim(),
      lastName: lastName.trim(),
      category,
      playerId: playerId.trim(),
    };

    const updatedPlayers = [...players, newPlayer];

    setPlayers(updatedPlayers);
    savePlayers(updatedPlayers);
    clearForm();
  };

  const editPlayer = (player) => {
    setName(player.name);
    setLastName(player.lastName);
    setCategory(player.category);
    setPlayerId(player.playerId || "");
    setEditingId(player.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deletePlayer = (id) => {
    const updatedPlayers = players.filter(
      (player) => player.id !== id
    );

    setPlayers(updatedPlayers);
    savePlayers(updatedPlayers);

    if (editingId === id) {
      clearForm();
    }
  };

  const filteredPlayers = players.filter((player) => {
    const text = `${player.name} ${player.lastName} ${player.playerId || ""}`
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        👥 Jugadores
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Administrá los participantes de tus torneos.
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingId ? "✏️ Editar jugador" : "➕ Agregar jugador"}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Nombre"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />

            <TextField
              label="Apellido"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              fullWidth
            />

            <TextField
              label="ID de jugador Pokémon (opcional)"
              value={playerId}
              onChange={(event) => setPlayerId(event.target.value)}
              fullWidth
            />

            <TextField
              select
              label="Categoría"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              fullWidth
            >
              <MenuItem value="Junior">Junior</MenuItem>
              <MenuItem value="Senior">Senior</MenuItem>
              <MenuItem value="Master">Master</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={savePlayer}
              >
                {editingId ? "Guardar cambios" : "Agregar jugador"}
              </Button>

              {editingId && (
                <Button
                  variant="outlined"
                  onClick={clearForm}
                >
                  Cancelar
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <TextField
        label="🔍 Buscar jugador"
        placeholder="Nombre, apellido o ID"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" gutterBottom>
        Jugadores registrados: {players.length}
      </Typography>

      <Stack spacing={2}>
        {filteredPlayers.map((player) => (
          <Card key={player.id}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <div>
                  <Typography variant="h6">
                    {player.name} {player.lastName}
                  </Typography>

                  <Typography color="text.secondary">
                    Categoría: {player.category}
                  </Typography>

                  {player.playerId && (
                    <Typography color="text.secondary">
                      ID Pokémon: {player.playerId}
                    </Typography>
                  )}
                </div>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => editPlayer(player)}
                  >
                    ✏️ Editar
                  </Button>

                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => deletePlayer(player.id)}
                  >
                    🗑️ Eliminar
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {filteredPlayers.length === 0 && (
          <Typography color="text.secondary">
            No se encontraron jugadores.
          </Typography>
        )}
      </Stack>
    </Container>
  );
}