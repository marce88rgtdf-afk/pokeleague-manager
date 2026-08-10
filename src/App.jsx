import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import Tournament from "./pages/Tournament";
import Standings from "./pages/Standings";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/players" element={<Players />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="/standings" element={<Standings />} />
      </Routes>
    </>
  );
}