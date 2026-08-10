import { Container, Typography } from "@mui/material";

export default function Standings() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Ranking
      </Typography>

      <Typography color="text.secondary">
        La clasificación de los torneos aparecerá aquí.
      </Typography>
    </Container>
  );
}