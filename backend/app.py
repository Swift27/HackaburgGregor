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

@app.route('/get-current-ssid', methods=['GET'])
def current_ssid():
    result = subprocess.run(['iwgetid', '-r'], capture_output=True, text=True)
    ssid = result.stdout.strip()
    return jsonify({'ssid': ssid})

if __name__ == '__main__':
    app.run(debug=True)