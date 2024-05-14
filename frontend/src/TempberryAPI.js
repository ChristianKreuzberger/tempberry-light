
const getBaseUrl = () => {
    if (window.location.host.toString().indexOf('localhost') >= 0) {
        return 'http://localhost:5000';
    }

    // prod
    console.log('PROD environment');
    return '';
}

export const fetchLiveData = () => {
    console.log(window.location.host.toString());

    return fetch(getBaseUrl() + '/live_temperatures').then((response) => response.json());
}

export const fetchRoomMapping = () => {
    console.log(window.location);

    return fetch(getBaseUrl() + '/room_sensor_id_map').then((response) => response.json());
}