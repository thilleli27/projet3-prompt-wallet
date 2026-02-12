import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewPrompt from "./pages/NewPrompt";
import EditPrompt from "./pages/EditPrompt";
import UsePrompt from "./pages/UsePrompt";
import About from "./pages/About";
import Cgu from "./pages/Cgu";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewPrompt />} />
        <Route path="/edit/:id" element={<EditPrompt />} />
        <Route path="/use/:id" element={<UsePrompt />} />
        <Route path="/about" element={<About />} />
        <Route path="/cgu" element={<Cgu />} />
      </Routes>
    </HashRouter>
  );
}
