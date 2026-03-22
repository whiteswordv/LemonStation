from flask import Flask, jsonify, request, send_file
from networktables import NetworkTables
import time

app = Flask(__name__, static_url_path="")
table = NetworkTables.getTable("LemonStation")


@app.route("/")
def index():
    return send_file("static/index.html")


@app.route("/tableConnected")
def isConnected():
    json_data = {
        "connected": NetworkTables.isConnected(),
    }

    return json_data


@app.route("/motors")
def motors():
    sub_tables = table.getSubTables()
    json_data = []

    for sub_name in sub_tables:
        sub_table = table.getSubTable(sub_name)

        json_data.append(
            {
                "id": int(sub_name),
                "brushless": sub_table.getBoolean("brushless", False),
                "disabled": sub_table.getBoolean("disabled", True),
                "type": sub_table.getString("type", ""),
                "speed": sub_table.getNumber("speed", 0),
                "faults": sub_table.getString("faults", ""),
            }
        )

    return jsonify(json_data)


@app.post("/speed/<int:id>")
def set_motor_speed(id):
    speed = request.args.get("v") or 0

    table.getSubTable(str(id)).putNumber("speed", speed / 100)


@app.post("/brushless/<int:id>")
def set_brushless(id):
    brushless = request.args.get("v") == "brushless"

    table.getSubTable(str(id)).putBoolean("brushless", brushless)


@app.post("/disabled/<int:id>")
def set_disabled(id):
    disabled = request.args.get("v") == "disabled"

    table.getSubTable(str(id)).putBoolean("disabled", disabled)


def main():

    NetworkTables.initialize(server="roboRIO-308-FRC")

    is_connected = NetworkTables.isConnected()

    while not is_connected:

        is_connected = NetworkTables.isConnected()
        time.sleep(0.5)

    app.run()


# get rid of this when making the pkg
if __name__ == "__main__":
    main()
