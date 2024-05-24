from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import time
import json
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():
    return "Hello, world!"

@app.route("/api-test")
def api():
    data = {"message": "Hello, world!"}
    return jsonify(data)

@app.route('/connect-wifi', methods=['POST'])
def connect_wifi():
    data = request.get_json()
    ssid = data.get('ssid')
    password = data.get('password')
    print(ssid, password)

    # Write data to json fild
    with open('wifi_data.json', 'w') as f:
        json.dump(data, f)

    # Turn off the access point
    subprocess.run(['nmcli', 'connection', 'down', 'id', 'accesspoint'])

    # Try to connect to the WiFi network using wlan1
    result = subprocess.run(['nmcli', 'dev', 'wifi', 'connect', ssid, 'password', password, 'ifname', 'wlan0'], capture_output=True, text=True)

    time.sleep(10)

    #if 'successfully activated with' in result.stdout:
    #    print('Successfully connected to the WiFi network.')
    #else:
    #    print('Failed to connect to the WiFi network.')

    return jsonify({'message': 'Connected to WiFi network.'})

@app.route('/get-current-ssid', methods=['GET'])
def current_ssid():
    # On raspberry: 
    """
    result = subprocess.run(['iwgetid', '-r'], capture_output=True, text=True)
    ssid = result.stdout.strip()
    return jsonify({'ssid': ssid})
    """

    # On macOS:

    result = subprocess.run(['/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', '-I'], capture_output=True, text=True)
    for line in result.stdout.split('\n'):
        if ' SSID' in line:
            return jsonify(line.split(': ')[1])
    return None

    
@app.route('/get-wifi-networks', methods=['GET'])
def wifi_networks():
    # On macOS:

    result = subprocess.run(['/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', '-s'], capture_output=True, text=True)
    networks = []
    lines = result.stdout.split('\n')
    for line in lines[1:]:
        if line:
            networks.append(line.split()[0])
    return jsonify(networks)


    # On raspberry:
    """
    result = subprocess.run(['sudo', 'iwlist', 'wlan0', 'scan'], capture_output=True, text=True)
    networks = []
    for line in result.stdout.split('\n'):
        if 'ESSID' in line:
            networks.append(line.split('"')[1])
    return jsonify(networks)
    """


@app.route('/send-user-data', methods=['POST'])
def send_user_data():
    user_data = request.get_json()
    print(user_data)

    with open('user_data.json', 'w') as f:
        json.dump(user_data, f)

    return jsonify({'message': 'User data saved.'})

@app.route('/get-user-data', methods=['GET'])
def get_user_data():
    with open('user_data.json', 'r') as f:
        user_data = json.load(f)
    return jsonify(user_data)

@app.route('/get-data-with-coordinates', methods=['POST'])
def get_data_with_coordinates():
    data = request.get_json() 

    street = data.get('street')
    houseNumber = data.get('houseNumber')
    postalCode = data.get('postalCode')
    city = data.get('city')
    country = data.get('country')
    forename = data.get('forename')
    surname = data.get('surname')
    phoneNumber = data.get('phoneNumber')

    response = requests.get(f'https://maps.googleapis.com/maps/api/geocode/json?address={street}+{houseNumber}+{postalCode}+{city}+{country}&key=AIzaSyBcFNLELRqXeRPIzmNvv3MK_cNYkQtNZMU')
    resp_json_payload = response.json()

    # Extract lat and lng from location
    lat = resp_json_payload['results'][0]['geometry']['location']['lat']
    lng = resp_json_payload['results'][0]['geometry']['location']['lng']

    # Combine resp_json_payload with forename, surname, phoneNumber, lat and lng
    combined_json = {
        'forename': forename,
        'surname': surname,
        'phoneNumber': phoneNumber,
        'coordinate_lat': lat,
        'coordinate_long': lng
    }
    return jsonify(combined_json)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")