import './App.css';
import { fetchLiveData, fetchRoomMapping } from './TempberryAPI';
import { useEffect, useState } from 'react';


function App() {
  const [roomData, setRoomData] = useState({});
  const [liveData, setLiveData] = useState({});

  const loadLiveData = async () => {
    setLiveData(await fetchLiveData());
  }

  const loadData = async () => {
    setRoomData(await fetchRoomMapping());
  };

  useEffect(() => {
    // data fetching here
    loadData();
    loadLiveData();
    setInterval(loadLiveData, 10000);
  }, []);

  // reload every 10 seconds
  // setInterval(loadLiveData, 10000);

  return (
    <div className="App">
      <header className="App-header">
        TempBerry Light
      </header>
      <div>
        {
          Object.keys(liveData).map((key, index) => ( 
            <div key={index}>
              <h3>{roomData[liveData[key]['sensor_id']] || "Sensor " + liveData[key]['sensor_id']}</h3>
              {liveData[key]['temperature']} °C, {liveData[key]['humidity']} %<br />
              Last Updated at {liveData[key]['last_updated']}<br />
            </div> 
          ))
        }
        {JSON.stringify(roomData)}
      </div>
    </div>
  );
}

export default App;
