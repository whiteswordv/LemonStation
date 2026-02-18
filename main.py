from flask import Flask, send_file, jsonify
from networktables import NetworkTables
import threading
import time

app = Flask(__name__, static_url_path="")

@app.route('/')
def index():
    return send_file('static/index.html')

if __name__ == "__main__":
    app.run()

#--- network setup UW0 

NetworkTables.setServerTeam(308, 1735) # 1735 the deafult port
NetworkTables.initialize()
table = NetworkTables.getTable("LemonStation")

def pending_connection():
    while not NetworkTables.isConnected():
        time.sleep(0.5)

threading.Thread(target=pending_connection, daemon=True).start() 

#stuff to generate the json thingy 

@app.route("/motors")
def motors():
    jsonData = {
        "id": table.getNumber("motorid", 0),
        "type": table.getString("motorType", ""),
        "disabled": table.getBoolean("disabled", False),
    }

    return jsonify(jsonData)