import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function BackToDashboard() {
  return (
    <Button
      component={Link}
      to="/"
      variant="outlined"
      sx={{ mt: 3 }}
    >
      🏠 Volver al Dashboard
    </Button>
  );
}