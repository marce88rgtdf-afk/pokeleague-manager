import { Button, Container, Stack, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        PokéLeague Manager
      </Typography>

      <Typography>
        Administrador de Torneos Pokémon TCG
      </Typography>

      <Stack spacing={2} mt={4}>
        <Button variant="contained">
          Nuevo Torneo
        </Button>

        <Button variant="contained">
          Jugadores
        </Button>

        <Button variant="contained">
          Ranking
        </Button>

        <Button variant="contained">
          Configuración
        </Button>
      </Stack>
    </Container>
  );
}