import './App.css';
import { fetchLiveData, fetchRoomMapping } from './TempberryAPI';
import { useEffect, useState } from 'react';
import RoomManager from './RoomManager';
import { WiThermometer, WiHumidity } from 'react-icons/wi';


function App() {
  const [roomData, setRoomData] = useState({});
  const [liveData, setLiveData] = useState({});
  const [theme, setTheme] = useState('dark');

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
    const interval = setInterval(loadLiveData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`App ${theme}`}>
      <header className="App-header">
        <span role="img" aria-label="thermometer" style={{marginRight: '0.5em'}}>🌡️</span>
        TempBerry
        <button className="theme-toggle" onClick={toggleTheme} style={{marginLeft: '1em'}}>
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <div className="sensor-list">
        {Object.keys(liveData).length === 0 && (
          <div className="no-sensors">No sensor data available.</div>
        )}
        {Object.keys(liveData).map((key, index) => (
          <div className="sensor-card" key={index}>
            <h3>{roomData[liveData[key]['sensor_id']] || `Sensor ${liveData[key]['sensor_id']}`}</h3>
            <div className="sensor-values">
              <span className="temp">
                <WiThermometer style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {liveData[key]['temperature']} °C
              </span>
              <span className="humidity">
                <WiHumidity style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {liveData[key]['humidity']} %
              </span>
            </div>
            <div className="last-updated">Last Updated: {liveData[key]['last_updated']}</div>
          </div>
        ))}
      </div>
      <RoomManager />
    </div>
  );
}

export default App;
