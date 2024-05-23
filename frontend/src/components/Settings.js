import React from "react";
import { useState, useEffect } from "react";

import "../styles/settings.css";

function Settings({ current_ssid }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handler for conneting to the selected wifi
  const connectWifiHandler = (event) => {
    event.preventDefault();
    console.log("Connecting to Wifi...");

    fetch("/connect-wifi", {
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

  // Getting all wifi networks available
  useEffect(() => {
    fetch("/get-wifi-networks")
      .then((response) => response.json())
      .then((data) => {
        setWifiNetworks(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="content">
      <h1>Settings</h1>

      <br />

      <section>
        <h2>Netzwerkeinstellungen</h2>
        <form onSubmit={connectWifiHandler}>
          Wählen Sie ein Netzwerk:
          <p>Verfügbare Netzwerke: </p>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <select
              name="ssid-select"
              onChange={(event) => {
                setSsid(event.target.value);
                console.log(event.target.value);
              }}
            >
              {wifiNetworks.map((network, index) => (
                <option key={`${network}-${index}`}>{network}</option>
              ))}
            </select>
          )}
          <label>
            Passwort:
            <input
              type="password"
              name="password-input"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button>Verbinden</button>
        </form>
      </section>

      <br />

      <section>
        <h2>Benutzerdaten</h2>
        <label>
          Vorname:
          <input type="text" />
        </label>
        <label>
          Nachname:
          <input type="text" />
        </label>
        <label>
          Telefonnummer:
          <input type="text" />
        </label>
        <label>
          Adresse:
          <input type="text" />
        </label>
        <label>
          Hausnummer:
          <input type="text" />
        </label>
        <label>
          Postleitzahl:
          <input type="text" />
        </label>
        <label>
          Land:
          <input type="text" />
        </label>
      </section>
    </div>
  );
}

export default Settings;

/*
<div className="content">
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
*/
