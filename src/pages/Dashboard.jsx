import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

export default function Dashboard() {
  const menuItems = [
    {
      title: "Jugadores",
      description: "Gestioná los jugadores registrados",
      icon: "👥",
      path: "/players",
    },
    {
      title: "Mis Torneos",
      description: "Creá y administrá tus torneos",
      icon: "🏆",
      path: "/my-tournaments",
    },
    {
      title: "Ranking",
      description: "Ver posiciones y estadísticas",
      icon: "📊",
      path: "/standings",
    },
    {
      title: "Nuevo Torneo",
      description: "Creá un nuevo torneo Suizo",
      icon: "🎮",
      path: "/tournament",
    },
    {
      title: "Configuración",
      description: "Ajustes de la aplicación",
      icon: "⚙️",
      path: "/settings",
    },
    {
      title: "Información",
      description: "Acerca de la aplicación",
      icon: "ℹ️",
      path: null,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",

        /*
         * FONDO
         * La imagen está dentro de:
         * public/play-center.jpeg
         */
        backgroundImage: `
          linear-gradient(
            rgba(10, 3, 25, 0.48),
            rgba(10, 3, 25, 0.70)
          ),
          url("/play-center.jpeg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",

        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* CAPA OSCURA */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(75,35,100,0.12), rgba(5,2,15,0.35))",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 1,
          py: {
            xs: 3,
            sm: 4,
            md: 5,
          },
        }}
      >
        {/* =========================================
            ENCABEZADO
        ========================================= */}

        <Box
          sx={{
            textAlign: "center",
            mb: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          {/* TROFEO */}
          <Typography
            sx={{
              fontSize: {
                xs: "3rem",
                sm: "3.5rem",
                md: "4rem",
              },
              lineHeight: 1,
              mb: 1,
              filter:
                "drop-shadow(0 4px 4px rgba(0,0,0,0.8))",
            }}
          >
            🏆
          </Typography>

          {/* TITULO */}
          <Typography
            component="h1"
            sx={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: {
                xs: "2.2rem",
                sm: "3rem",
                md: "3.5rem",
              },
              lineHeight: 1.05,
              letterSpacing: "-1px",
              textShadow:
                "0 4px 8px rgba(0,0,0,0.9)",
              mb: 1,
            }}
          >
            PokéLeague Manager
          </Typography>

          {/* LINEA */}
          <Box
            sx={{
              width: {
                xs: "180px",
                sm: "280px",
                md: "360px",
              },
              height: "2px",
              mx: "auto",
              mb: 1.5,
              background:
                "linear-gradient(90deg, transparent, #d6a93a, transparent)",
            }}
          />

          {/* POKEBALL */}
          <Typography
            sx={{
              fontSize: {
                xs: "1.7rem",
                sm: "2rem",
              },
              lineHeight: 1,
              mb: 1,
            }}
          >
            🔴
          </Typography>

          {/* SUBTITULO */}
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: {
                xs: "1rem",
                sm: "1.15rem",
                md: "1.3rem",
              },
              fontWeight: 500,
              textShadow:
                "0 2px 5px rgba(0,0,0,0.9)",
            }}
          >
            Administrá tus torneos Pokémon TCG
          </Typography>
        </Box>

        {/* =========================================
            MENU PRINCIPAL
        ========================================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          {menuItems.map((item) => {
            const cardContent = (
              <Card
                sx={{
                  height: {
                    xs: "190px",
                    sm: "200px",
                    md: "210px",
                  },

                  borderRadius: "18px",

                  background:
                    "linear-gradient(145deg, rgba(45,27,58,0.88), rgba(24,13,35,0.94))",

                  border:
                    "2px solid rgba(176,91,255,0.72)",

                  boxShadow:
                    "0 8px 25px rgba(0,0,0,0.45)",

                  backdropFilter:
                    "blur(5px)",

                  transition:
                    "all 0.25s ease",

                  cursor:
                    item.path ? "pointer" : "default",

                  "&:hover": item.path
                    ? {
                        transform:
                          "translateY(-5px) scale(1.02)",
                        borderColor:
                          "#d6a3ff",
                        boxShadow:
                          "0 12px 35px rgba(0,0,0,0.65)",
                        background:
                          "linear-gradient(145deg, rgba(58,34,74,0.94), rgba(30,16,43,0.96))",
                      }
                    : {},
                }}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    p: {
                      xs: 2,
                      sm: 2.5,
                    },
                    "&:last-child": {
                      pb: {
                        xs: 2,
                        sm: 2.5,
                      },
                    },
                  }}
                >
                  {/* ICONO */}

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "3rem",
                        sm: "3.3rem",
                        md: "3.5rem",
                      },
                      lineHeight: 1,
                      mb: 1.2,

                      filter:
                        "drop-shadow(0 3px 3px rgba(0,0,0,0.8))",
                    }}
                  >
                    {item.icon}
                  </Typography>

                  {/* TITULO */}

                  <Typography
                    sx={{
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: {
                        xs: "1.2rem",
                        sm: "1.3rem",
                        md: "1.4rem",
                      },
                      lineHeight: 1.15,
                      textShadow:
                        "0 2px 4px rgba(0,0,0,0.8)",
                      mb: 0.8,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* DESCRIPCION */}

                  <Typography
                    sx={{
                      color:
                        "rgba(255,255,255,0.78)",
                      fontSize: {
                        xs: "0.85rem",
                        sm: "0.9rem",
                        md: "0.95rem",
                      },
                      lineHeight: 1.3,
                      maxWidth: "210px",
                      textShadow:
                        "0 1px 3px rgba(0,0,0,0.8)",
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            );

            /*
             * Si tiene ruta, hacemos que toda la tarjeta
             * sea un botón/link.
             */

            if (item.path) {
              return (
                <Box
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  {cardContent}
                </Box>
              );
            }

            return (
              <Box key={item.title}>
                {cardContent}
              </Box>
            );
          })}
        </Box>

        {/* =========================================
            PIE DE PÁGINA
        ========================================= */}

        <Box
          sx={{
            textAlign: "center",
            mt: {
              xs: 4,
              sm: 5,
            },
          }}
        >
          {/* LINEA */}

          <Box
            sx={{
              width: {
                xs: "180px",
                sm: "260px",
              },
              height: "2px",
              mx: "auto",
              mb: 2,
              background:
                "linear-gradient(90deg, transparent, #d6a93a, transparent)",
            }}
          />

          {/* POKEBALL */}

          <Typography
            sx={{
              fontSize: "1.8rem",
              lineHeight: 1,
              mb: 1,
            }}
          >
            🔴
          </Typography>

          {/* VERSION */}

          <Typography
            sx={{
              color: "#f2c94c",
              fontWeight: 700,
              fontSize: "0.9rem",
              textShadow:
                "0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            Versión 0.3.6
          </Typography>

          <Typography
            sx={{
              color: "#ffffff",
              fontSize: "0.85rem",
              mt: 0.3,
              textShadow:
                "0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            PokéLeague Manager
          </Typography>

          <Typography
            sx={{
              color: "#c9a0ff",
              fontSize: "0.85rem",
              mt: 0.3,
              textShadow:
                "0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            © 2026 - Play! Center
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}