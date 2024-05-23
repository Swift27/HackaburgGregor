import React, { useEffect, useState } from "react";

function App() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  const [current_ssid, setCurrentSsid] = useState("");

  useEffect(() => {
    fetch("/get-current-ssid")
      .then((response) => response.json())
      .then((data) => {
        setCurrentSsid(data.ssid);
        console.log(data.ssid);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("/connect_wifi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ssid, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="App">
      <h1>Current SSID: {current_ssid}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          SSID:
          <input
            type="text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Connect</button>
      </form>
    </div>
  );
}

export default App;
