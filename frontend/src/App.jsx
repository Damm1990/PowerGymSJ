import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Socios from "./pages/Socios";
import SocioView from "./pages/SociosView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/socios" element={<Socios />} />
        <Route path="/socios/:id" element={<SocioView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;