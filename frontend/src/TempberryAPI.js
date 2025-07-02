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

export const createRoom = (id, name) => {
    return fetch(getBaseUrl() + '/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
    }).then(res => res.json());
};

export const updateRoom = (id, name) => {
    return fetch(getBaseUrl() + `/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    }).then(res => res.json());
};

export const deleteRoom = (id) => {
    return fetch(getBaseUrl() + `/rooms/${id}`, {
        method: 'DELETE'
    }).then(res => res.json());
};