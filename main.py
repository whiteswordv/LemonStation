from flask import Flask, jsonify, request, send_file
from networktables import NetworkTables

app = Flask(__name__, static_url_path="")


def set_team(number):
    NetworkTables.setServerTeam(number)


set_team(308)
NetworkTables.initialize()
table = NetworkTables.getTable("LemonStation")


@app.route("/")
def index():
    return send_file("static/index.html")


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
            }
        )

    return jsonify(json_data)


@app.post("/speed/<int:id>")
def set_motor_speed(id):
    speed = request.args.get("v") or 0

    table.getSubTable(str(id)).putNumber("speed", speed)

@app.post("/brushless/<int:id>")
def set_brushless(id):
    brushless = request.args.get("v") == "brushless";

    table.getSubTable(str(id)).putNumber("brushless", brushless)


if __name__ == "__main__":
    app.run()
