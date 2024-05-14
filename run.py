from flask import Flask, json, request
from datetime import datetime
from flask_cors import CORS, cross_origin

ROOM_DATA_FILE = 'rooms.json'

sensor_data = {}

room_sensor_id_map = {}

api = Flask(__name__, static_folder='static', static_url_path='')

def write_room_data_to_file():
  with open(ROOM_DATA_FILE, "w") as outfile:
    outfile.write(json.dumps(room_sensor_id_map))

def load_room_data_to_file():
  try:
    with open(ROOM_DATA_FILE, "r") as infile:
      data = "\n".join(infile.readlines())
      return json.loads(data)
  except FileNotFoundError:
    print('Skipping loading as ' + ROOM_DATA_FILE + ' does not exist')

# Get All Room Names
@api.route('/room_sensor_id_map', methods=['GET'])
@cross_origin(origin='*')
def get_room_sensor_id_map():
  return json.dumps(room_sensor_id_map)

# Add a room to the sensor id map
@api.route('/room_sensor_id_map', methods=['POST'])
@cross_origin(origin='*')
def post_room_sensor_id_map():
  data = request.json
  assert data['sensor_id'] != None, "Missing sensor_id"
  assert data['room_name'] != None, "Missing room_name"
  room_sensor_id_map[data['sensor_id']] = data['room_name']

  write_room_data_to_file()

  return json.dumps(room_sensor_id_map), 201


# Get All Live Temperature Data 
@api.route('/live_temperatures', methods=['GET'])
@cross_origin(origin='*')
def get_temperatures():
  return json.dumps(sensor_data)

@api.route('/sensor_data', methods=['POST'])
@cross_origin(origin='*')
def post_temperatures():
  data = request.json
  assert data['sensor_id'] != None, "Missing sensor_id"
  assert data['temperature'] != None, "Missing temperature"
  assert data['humidity'] != None, "Missing humidity"
  sensor_data[data['sensor_id']] = data
  sensor_data[data['sensor_id']]['last_updated'] = datetime.now()
  return json.dumps({"success": True}), 201


@api.route('/')
def root():
  return api.send_static_file('index.html')

# host static files (frontend)
@api.route('/<path:path>')
def static_file(path):
    print("PATH=" + path)
    return api.send_static_file(path)


if __name__ == '__main__':
  room_sensor_id_map = load_room_data_to_file()
  api.run(debug=True)
