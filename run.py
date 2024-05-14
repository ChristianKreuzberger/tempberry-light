from flask import Flask, json, request
from datetime import datetime

ROOM_DATA_FILE = 'rooms.json'

sensor_data = {}

room_sensor_id_map = {}

api = Flask(__name__)

def write_room_data_to_file():
  with open(ROOM_DATA_FILE, "w") as outfile:
    outfile.write(json.dumps(room_sensor_id_map))

def load_room_data_to_file():
  try:
    with open(ROOM_DATA_FILE, "r") as infile:
      data = "\n".join(infile.readlines())
      room_sensor_id_map = json.loads(data)
  except FileNotFoundError:
    print('Skipping loading as ' + ROOM_DATA_FILE + ' does not exist')

# Get All Room Names
@api.route('/room_sensor_id_map', methods=['GET'])
def get_room_sensor_id_map():
  return json.dumps(room_sensor_id_map)

# Add a room to the sensor id map
@api.route('/room_sensor_id_map', methods=['POST'])
def post_room_sensor_id_map():
  data = request.json
  assert data['sensor_id'] != None, "Missing sensor_id"
  assert data['room_name'] != None, "Missing room_name"
  room_sensor_id_map[data['sensor_id']] = data['room_name']

  write_room_data_to_file()

  return json.dumps(room_sensor_id_map), 201


# Get All Live Temperature Data 
@api.route('/live_temperatures', methods=['GET'])
def get_temperatures():
  return json.dumps(sensor_data)

@api.route('/sensor_data', methods=['POST'])
def post_temperatures():
  data = request.json
  assert data['sensor_id'] != None, "Missing sensor_id"
  assert data['temperature'] != None, "Missing temperature"
  assert data['humidity'] != None, "Missing humidity"
  sensor_data[data['sensor_id']] = data
  sensor_data[data['sensor_id']]['last_updated'] = datetime.now()
  return json.dumps({"success": True}), 201

# host static files (frontend)
# url_for('static', filename='style.css')


if __name__ == '__main__':
  load_room_data_to_file()
  api.run(debug=True)
