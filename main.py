from flask import Flask, jsonify, request, send_file
from networktables import NetworkTables

app = Flask(__name__, static_url_path="")
table = NetworkTables.getTable("LemonStation")

server = "roboRIO-308-FRC"


@app.route("/")
def index():
    return send_file("static/index.html")


@app.route("/tableConnected")
def isConnected():
    if not NetworkTables.isConnected():
        NetworkTables.initialize(server=server)

    json_data = {"connected": NetworkTables.isConnected()}

    return jsonify(json_data)


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
                "type": sub_table.getString("type", ""),
                "speed": sub_table.getNumber("speed", 0),
                "faults": sub_table.getString("faults", ""),
                "stickyFaults": sub_table.getString("stickyFaults", ""),
                "focused": sub_table.getBoolean("focused"),
            }
        )

    return jsonify(json_data)


@app.post("/speed/<int:id>")
def set_motor_speed(id):
    speed = request.args.get("v") or 0

    table.getSubTable(str(id)).putNumber("speed", speed)


@app.post("/brushless/<int:id>")
def set_brushless(id):
    brushless = request.args.get("v") == "brushless"

    table.getSubTable(str(id)).putBoolean("brushless", brushless)


@app.post("/focused/<int:id>")
def set_focused(id):
    focused = request.args.get("v") == "focused"

    table.getSubTable(str(id)).putBoolean("focused", focused)


def main():
    NetworkTables.initialize(server=server)
    app.run(port=5000)


# get rid of this when making the pkg
if __name__ == "__main__":
    main()
