import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import WeddingParty from "./pages/WeddingParty/WeddingParty";
import Gallery from "./pages/Gallery/Gallery";
import Registry from "./pages/Registry/Registry";
import FAQ from "./pages/FAQ/FAQ";
import RSVP from "./pages/RSVP/RSVP";
import RSVPManagement from "./pages/Admin/RSVPManagement";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin routes without layout */}
          <Route path="/admin/rsvp-management" element={<RSVPManagement />} />

          {/* Public routes with layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/wedding-party" element={<WeddingParty />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/registry" element={<Registry />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/rsvp" element={<RSVP />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
