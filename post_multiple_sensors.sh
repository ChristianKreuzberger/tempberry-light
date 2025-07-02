#!/bin/bash
# Bash script to post multiple sensor data for multiple sensor IDs to the TempBerry backend

API_URL="http://localhost:5000/sensor_data"

# Array of sensor data (sensor_id temperature humidity)
sensors=(
  "1 25.0 10.0"
  "2 11.0 25.0"
  "3 11.0 25.0"
  "4 18.5 40.0"
  "5 22.3 35.0"
  "6 19.8 50.0"
  "7 27.1 20.0"
  "8 15.2 60.0"
)

for entry in "${sensors[@]}"; do
  set -- $entry
  sensor_id=$1
  temperature=$2
  humidity=$3
  curl -X POST "$API_URL" \
    -H "Accept: application/json" \
    -H "Cache-Control: no-cache" \
    -H "Content-Type: application/json" \
    -d '{"sensor_id": '"$sensor_id"', "temperature": '"$temperature"', "humidity": '"$humidity"'}'
  echo "Posted sensor_id $sensor_id"
  sleep 1
done
