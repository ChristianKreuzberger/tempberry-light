const baseUrl = 'http://localhost:5000';

export const fetchLiveData = () => {
    return fetch(baseUrl + '/live_temperatures').then((response) => response.json());
}

export const fetchRoomMapping = () => {
    return fetch(baseUrl + '/room_sensor_id_map').then((response) => response.json());
}