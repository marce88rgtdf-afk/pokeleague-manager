import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        ⚙️ Configuración
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Configuración general de PokéLeague Manager.
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">
              ⚙️ Configuración general
            </Typography>

            <Typography color="text.secondary">
              Esta sección estará disponible para configurar
              diferentes opciones del administrador de torneos.
            </Typography>

            <Typography>
              🔹 Próximamente podremos agregar:
            </Typography>

            <Typography>
              • Configuración de puntuación
            </Typography>

            <Typography>
              • Opciones del sistema suizo
            </Typography>

            <Typography>
              • Cantidad de rondas predeterminadas
            </Typography>

            <Typography>
              • Configuración de categorías
            </Typography>

            <Typography>
              • Preferencias generales del torneo
            </Typography>

            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{ mt: 2 }}
            >
              🏠 Volver al Dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}