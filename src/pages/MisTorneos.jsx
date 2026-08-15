import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";
import { getTournaments } from "../services/storage";

export default function MisTorneos() {
  const [tournaments] = useState(getTournaments());

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* VOLVER AL DASHBOARD */}

      <Button
        component={Link}
        to="/"
        variant="outlined"
        sx={{ mb: 3 }}
      >
        ← Volver al Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        🏆 Mis Torneos
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Torneos guardados en PokéLeague Manager.
      </Typography>

      {tournaments.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Todavía no hay torneos creados.
            </Typography>

            <Button
              component={Link}
              to="/tournament"
              variant="contained"
              sx={{ mt: 2 }}
            >
              🏆 Crear torneo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {tournaments.map((tournament) => (
            <Card key={tournament.id}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <div>
                    <Typography variant="h6">
                      🏆 {tournament.name}
                    </Typography>

                    <Typography color="text.secondary">
                      Formato: {tournament.format}
                    </Typography>

                    <Typography color="text.secondary">
                      Fecha: {tournament.date}
                    </Typography>

                    <Typography color="text.secondary">
                      Participantes: {tournament.playerIds.length}
                    </Typography>
                  </div>

                  <Button
                    component={Link}
                    to={`/tournament/${tournament.id}`}
                    variant="contained"
                  >
                    Abrir torneo
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}