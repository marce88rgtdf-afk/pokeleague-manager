import { Container, Typography } from "@mui/material";

export default function Tournament() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🏆 Torneo
      </Typography>

      <Typography color="text.secondary">
        Desde aquí vamos a crear y administrar nuestros torneos.
      </Typography>
    </Container>
  );
}