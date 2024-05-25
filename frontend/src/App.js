import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import History from "./components/History";

import "./index.css";

function App() {
  const [current_ssid, setCurrentSsid] = useState("");
  const BASE_URL = "http://raspberrypi.local:5000";

  // Get the current ssid
  useEffect(() => {
    fetch(`${BASE_URL}/get-current-ssid`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentSsid(data.ssid);
        console.log(data.ssid);
      });
  }, []);

  const handleNetworkChange = (new_ssid) => {
    setCurrentSsid(new_ssid);
  };

  return (
    <Router>
      <div className="App">
        <NavBar current_ssid={current_ssid} />
        <Routes>
          <Route
            path="/"
            element={
              <Settings
                current_ssid={current_ssid}
                onNetworkChange={handleNetworkChange}
              />
            }
          />
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
