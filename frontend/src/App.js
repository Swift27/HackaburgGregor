import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import History from "./components/History";

function App() {
  const [current_ssid, setCurrentSsid] = useState("");

  // Get the current ssid
  useEffect(() => {
    fetch("/get-current-ssid")
      .then((response) => response.json())
      .then((data) => {
        setCurrentSsid(data);
        console.log(data);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <NavBar current_ssid={current_ssid} />
        <Routes>
          <Route path="/" element={<Settings current_ssid={current_ssid} />} />
          <Route
            path="/settings"
            element={<Settings current_ssid={current_ssid} />}
          />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
