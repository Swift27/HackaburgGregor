import React from "react";
import { useState, useEffect } from "react";

import "../styles/settings.css";

function Settings({ current_ssid, onNetworkChange }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
  });

  // Updating the user data on input changes
  const handleInputChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  // Handler for conneting to the selected wifi
  const connectWifiHandler = (event) => {
    event.preventDefault();
    console.log("Connecting to Wifi...");

    fetch("http://localhost:5000/connect-wifi", {
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
    onNetworkChange(ssid);
  };

  // Getting all wifi networks available
  useEffect(() => {
    fetch("http://localhost:5000/get-wifi-networks")
      .then((response) => response.json())
      .then((data) => {
        setWifiNetworks(data);
        setIsLoading(false);
      });
  }, []);

  const sendUserData = (event) => {
    console.log("Sending user data...");
    event.preventDefault();

    fetch("http://192.168.220.183:8080/stuff/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => console.log(response))
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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

      <section className="user-data">
        <form onSubmit={sendUserData}>
          <h2>Benutzerdaten</h2>
          <label>
            Vorname:
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Nachname:
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Telefonnummer:
            <input
              type="text"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Adresse:
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Hausnummer:
            <input
              type="text"
              name="houseNumber"
              value={userData.houseNumber}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Postleitzahl:
            <input
              type="text"
              name="postalCode"
              value={userData.postalCode}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Stadt:
            <input
              type="text"
              name="city"
              value={userData.city}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Land:
            <input
              type="text"
              name="country"
              value={userData.country}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Send</button>
        </form>
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
