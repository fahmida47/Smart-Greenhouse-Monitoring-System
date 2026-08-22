import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:8000/api/greenhouse/status";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGreenhouseData = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch greenhouse data");
      }

      const result = await response.json();

      if (result.data) {
        setData(result.data);
      } else {
        setData(null);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to greenhouse server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGreenhouseData();

    const interval = setInterval(fetchGreenhouseData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="greenhouse-app dashboard-loading">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <h2>Connecting to Greenhouse...</h2>
          <p>Fetching live sensor data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="greenhouse-app dashboard-loading">
        <div className="loading-card error-card">
          <div className="error-icon">⚠️</div>
          <h2>Connection Error</h2>
          <p>{error}</p>

          <button onClick={fetchGreenhouseData}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="greenhouse-app dashboard-loading">
        <div className="loading-card">
          <div className="empty-icon">🌱</div>
          <h2>No Sensor Data</h2>
          <p>The greenhouse has not sent any sensor readings yet.</p>

          <button onClick={fetchGreenhouseData}>Refresh</button>
        </div>
      </div>
    );
  }

  const environmentHealth = calculateHealth(data);

  return (
    <div className="greenhouse-app">
      <header className="dashboard-header">
        <div>
          <p className="welcome-text">Good Morning 🌿</p>
          <h1>Smart Greenhouse</h1>
        </div>

        <div className="live-status">
          <span className="live-dot"></span>
          LIVE
        </div>
      </header>

      <section className="health-card">
        <div className="health-card-top">
          <div>
            <p className="section-label">GREENHOUSE STATUS</p>

            <h2>
              {environmentHealth >= 70
                ? "Healthy Environment"
                : "Needs Attention"}
            </h2>

            <p className="health-description">
              Your greenhouse is running automatically.
            </p>
          </div>

          <div className="health-ring">
            <div className="health-ring-inner">
              <strong>{environmentHealth}%</strong>
              <span>HEALTHY</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Environment</h2>
          <span>Live Data</span>
        </div>

        <div className="sensor-grid">
          <div className="sensor-card">
            <div className="sensor-icon temperature">🌡️</div>
            <p>Temperature</p>
            <strong>{data.temperature}°C</strong>
            <span className="sensor-status">● Normal</span>
          </div>

          <div className="sensor-card">
            <div className="sensor-icon humidity">💧</div>
            <p>Humidity</p>
            <strong>{data.humidity}%</strong>
            <span className="sensor-status">● Normal</span>
          </div>

          <div className="sensor-card">
            <div className="sensor-icon soil">🌱</div>
            <p>Soil Moisture</p>
            <strong>{data.soil_moisture}%</strong>
            <span className="sensor-status">● Good</span>
          </div>

          <div className="sensor-card">
            <div className="sensor-icon light">☀️</div>
            <p>Light Intensity</p>
            <strong>{data.light_intensity}%</strong>
            <span className="sensor-status">● Good</span>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Weather</h2>
        </div>

        <div className="weather-card">
          <div className="weather-icon">{data.rain_detected ? "🌧️" : "☀️"}</div>

          <div>
            <p>Rain Status</p>

            <strong>{data.rain_detected ? "RAIN DETECTED" : "NO RAIN"}</strong>
          </div>

          <span className="safe-badge">
            ● {data.rain_detected ? "Alert" : "Safe"}
          </span>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Automatic System</h2>
          <span>Hardware Output</span>
        </div>

        <div className="device-list">
          <div className={`device-card ${data.water_pump ? "active" : ""}`}>
            <div className="device-info">
              <div className="device-icon">💧</div>

              <div>
                <h3>Water Pump</h3>
                <p>Automatic irrigation</p>
              </div>
            </div>

            <span className="device-status">
              ● {data.water_pump ? "ON" : "OFF"}
            </span>
          </div>

          <div className={`device-card ${data.exhaust_fan ? "active" : ""}`}>
            <div className="device-info">
              <div className="device-icon">🌀</div>

              <div>
                <h3>Exhaust Fan</h3>
                <p>Temperature control</p>
              </div>
            </div>

            <span className="device-status">
              ● {data.exhaust_fan ? "ON" : "OFF"}
            </span>
          </div>

          <div className={`device-card ${data.grow_light ? "active" : ""}`}>
            <div className="device-info">
              <div className="device-icon">💡</div>

              <div>
                <h3>Grow Light</h3>
                <p>Artificial lighting</p>
              </div>
            </div>

            <span className="device-status">
              ● {data.grow_light ? "ON" : "OFF"}
            </span>
          </div>

          <div
            className={`device-card ${
              data.roof_status === "OPEN" ? "active" : ""
            }`}
          >
            <div className="device-info">
              <div className="device-icon">🏠</div>

              <div>
                <h3>Greenhouse Roof</h3>
                <p>Automatic roof control</p>
              </div>
            </div>

            <span className="device-status">● {data.roof_status}</span>
          </div>
        </div>
      </section>

      <nav className="bottom-nav">
        <div className="nav-item active">
          <span>⌂</span>
          <small>Home</small>
        </div>

        <div className="nav-item">
          <span>◉</span>
          <small>Environment</small>
        </div>

        <div className="nav-item">
          <span>◌</span>
          <small>Activity</small>
        </div>
      </nav>
    </div>
  );
}

function calculateHealth(data) {
  let score = 100;

  if (Number(data.temperature) > 32) {
    score -= 20;
  }

  if (Number(data.temperature) < 15) {
    score -= 15;
  }

  if (Number(data.humidity) < 40) {
    score -= 15;
  }

  if (Number(data.humidity) > 85) {
    score -= 15;
  }

  if (Number(data.soil_moisture) < 30) {
    score -= 20;
  }

  if (data.rain_detected) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

export default Dashboard;
