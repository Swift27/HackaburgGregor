import React, { useState, useEffect } from "react";
import "../styles/settings.css";

function Settings({ current_ssid, onNetworkChange }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInputData, setUserInputData] = useState({
    forename: "",
    surname: "",
    phoneNumber: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
  });

  // Setting the user data to the stored data
  useEffect(() => {
    fetch("http://localhost:5000/get-user-data")
      .then((response) => response.json())
      .then((data) => setUserInputData(data));
  }, []);

  // Updating the userData when changing the input fields
  const handleInputChange = (event) => {
    setUserInputData({
      ...userInputData,
      [event.target.name]: event.target.value,
    });
  };

  // POST request to connect to the selected wifi network
  const connectWifiHandler = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/connect-wifi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ssid, password }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));
    onNetworkChange(ssid);
  };

  // GET request to get the available wifi networks
  useEffect(() => {
    fetch("http://localhost:5000/get-wifi-networks")
      .then((response) => response.json())
      .then((data) => {
        setWifiNetworks(data);
        setIsLoading(false);
      });
  }, []);

  // POST request to send the user data
  // 1. Send to Henkriks server
  // 2. Send to app.py to write to txt file
  const sendUserData = (event) => {
    event.preventDefault();
    console.log(userInputData);
    const jsonUserInputData = JSON.stringify(userInputData);
    const headers = { "Content-Type": "application/json" };
    const postMethodUserInput = {
      method: "POST",
      headers,
      body: jsonUserInputData,
    };

    // Send to app.py to write to txt file
    fetch("http://localhost:5000/send-user-data", postMethodUserInput)
      .then((response) => console.log(response))
      .catch((error) => console.error("Error:", error));

    // Converting the user address to coordinates
    fetch(
      "http://localhost:5000/get-data-with-coordinates",
      postMethodUserInput
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));

        // Prepare the options for the second fetch call
        let postMethodHenrik = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data), // Use the data from the first fetch call
        };

        // Send to Henkriks server
        fetch("http://192.168.220.183:8080/general/addperson", postMethodHenrik)
          .then((response) => console.log(response))
          .catch((error) => console.error("Error:", error));
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="content settings">
      <h1>Settings</h1>
      <br />
      <section className="network-settings settings-container">
        <h2>Netzwerkeinstellungen</h2>
        <p>
          Sie sind momentan mit{" "}
          {current_ssid !== ""
            ? `dem WLAN "${current_ssid}" verbunden.`
            : "keinen WLAN verbunden."}
        </p>
        <form onSubmit={connectWifiHandler}>
          <p>
            Wählen Sie ein Netzwerk aus, falls Sie sich mit einem anderen WLAN
            verbinden möchten:
          </p>
          <div className="network-input">
            <p>Verfügbare Netzwerke: </p>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <select
                value={ssid !== "" ? ssid : current_ssid}
                name="ssid-select"
                onChange={(event) => setSsid(event.target.value)}
              >
                {wifiNetworks.map((network, index) => (
                  <option key={`${network}-${index}`}>{network}</option>
                ))}
              </select>
            )}
            <p>Passwort:</p>
            <input
              type="password"
              name="password-input"
              placeholder="Passwort"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button>Verbinden</button>
        </form>
      </section>
      <br />
      <section className="user-settings settings-container">
        <form onSubmit={sendUserData}>
          <h2>Benutzerdaten</h2>
          <p>Bearbeiten Sie Ihre Benutzerdaten:</p>
          <div className="user-data-input">
            <div className="name-input label-row">
              <label>
                Vorname:
                <input
                  type="text"
                  name="forename"
                  placeholder="Vorname"
                  value={userInputData.forename}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Nachname:
                <input
                  type="text"
                  name="surname"
                  placeholder="Nachname"
                  value={userInputData.surname}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Telefonnummer"
                  value={userInputData.phoneNumber}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="location-input label-row">
              <label>
                Straße:
                <input
                  type="text"
                  name="street"
                  placeholder="Straße"
                  value={userInputData.street}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Hausnummer:
                <input
                  type="number"
                  name="houseNumber"
                  placeholder="Hausnummer"
                  value={userInputData.houseNumber}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Postleitzahl:
                <input
                  type="number"
                  name="postalCode"
                  placeholder="postalCode"
                  value={userInputData.postalCode}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Stadt:
                <input
                  type="text"
                  name="city"
                  placeholder="Stadt"
                  value={userInputData.city}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Land:
                <input
                  type="text"
                  name="country"
                  placeholder="Land"
                  value={userInputData.country}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <button type="submit">Bearbeiten</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Settings;
