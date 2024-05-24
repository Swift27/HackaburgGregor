import React, { useState, useEffect } from "react";
import "../styles/settings.css";

function Settings({ current_ssid, onNetworkChange }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    forename: "",
    surname: "",
    coordinate_lat: "",
    coordinate_long: "",
    phoneNumber: "",
  });

  // Setting the user data to the stored data
  useEffect(() => {
    fetch("http://localhost:5000/get-user-data")
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  // Updating the userData when changing the input fields
  const handleInputChange = (event) => {
    setUserData({
      ...userData,
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
    const jsonUserData = JSON.stringify(userData);
    const headers = { "Content-Type": "application/json" };
    const postMethod = { method: "POST", headers, body: jsonUserData };

    // Send to Henkriks server
    /*
    fetch("http://192.168.220.183:8080/general/addperson", postMethod)
      .then((response) => console.log(response))
      .catch((error) => console.error("Error:", error));
    */

    // Send to app.py to write to txt file
    fetch("http://localhost:5000/send-user-data", postMethod)
      .then((response) => console.log(response))
      .catch((error) => console.error("Error:", error));
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
              value={ssid !== "" ? ssid : current_ssid}
              name="ssid-select"
              onChange={(event) => setSsid(event.target.value)}
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
              name="forename"
              value={userData.forename}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Nachname:
            <input
              type="text"
              name="surname"
              value={userData.surname}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Coordinate Lat:
            <input
              type="text"
              name="coordinate_lat"
              value={userData.coordinate_lat}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Coordinate Long:
            <input
              type="text"
              name="coordinate_long"
              value={userData.coordinate_long}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={userData.phoneNumber}
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
