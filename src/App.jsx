import { Route, Routes } from "react-router";
import Layout from "./components/layout";
import Map from "./pages/map";
import Level from "./pages/level";
import Dungeon from "./pages/dungeon";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Map />} />
        <Route path="/level/:branch/:num" element={<Level />} />
        <Route path="/dungeon" element={<Dungeon />} />
      </Route>
    </Routes>
  );
}