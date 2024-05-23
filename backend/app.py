from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import time

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
    print(f'SSID: {ssid}, Password: {password}')

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
    result = subprocess.run(['iwgetid', '-r'], capture_output=True, text=True)
    ssid = result.stdout.strip()
    return jsonify({'ssid': ssid})

    # On macOS:
    # result = subprocess.run(['/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', '-I'], capture_output=True, text=True)
    # for line in result.stdout.split('\n'):
    #     if ' SSID' in line:
    #         return jsonify(line.split(': ')[1])
    # return None

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")