import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import FAQ from "./pages/FAQ/FAQ";
import Gallery from "./pages/Gallery/Gallery";
import RSVP from "./pages/RSVP/RSVP";
import WeddingParty from "./pages/WeddingParty/WeddingParty";
import Registry from "./pages/Registry/Registry";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/wedding-party" element={<WeddingParty />} />
          <Route path="/registry" element={<Registry />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
