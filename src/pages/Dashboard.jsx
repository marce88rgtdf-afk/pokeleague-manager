import {
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        🏆 PokéLeague Manager
      </Typography>

      <Typography>
        Administrador de Torneos Pokémon TCG
      </Typography>

      <Stack spacing={2} mt={4}>
        <Button
          component={Link}
          to="/tournament"
          variant="contained"
        >
          🏆 Nuevo Torneo
        </Button>

        <Button
          component={Link}
          to="/players"
          variant="contained"
        >
          👥 Jugadores
        </Button>

        <Button
          component={Link}
          to="/standings"
          variant="contained"
        >
          📊 Ranking
        </Button>

        <Button
          component={Link}
          to="/my-tournaments"
          variant="contained"
        >
          🏆 Mis Torneos
        </Button>

        <Button
          variant="contained"
        >
          ⚙️ Configuración
        </Button>
      </Stack>
    </Container>
  );
}