import { greenhouseData } from "../../data/mockData";
import "./Dashboard.css";

function Dashboard() {
  const data = greenhouseData;

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
            <h2>Healthy Environment</h2>
            <p className="health-description">
              Your greenhouse is running automatically.
            </p>
          </div>

          <div className="health-ring">
            <div className="health-ring-inner">
              <strong>{data.environmentHealth}%</strong>
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
            <strong>{data.soilMoisture}%</strong>
            <span className="sensor-status">● Good</span>
          </div>

          <div className="sensor-card">
            <div className="sensor-icon light">☀️</div>
            <p>Light Intensity</p>
            <strong>{data.light}%</strong>
            <span className="sensor-status">● Good</span>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Weather</h2>
        </div>

        <div className="weather-card">
          <div className="weather-icon">🌧️</div>

          <div>
            <p>Rain Status</p>
            <strong>{data.rain ? "RAIN DETECTED" : "NO RAIN"}</strong>
          </div>

          <span className="safe-badge">● {data.rain ? "Alert" : "Safe"}</span>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Automatic System</h2>
          <span>Hardware Output</span>
        </div>

        <div className="device-list">
          <div className={`device-card ${data.waterPump ? "active" : ""}`}>
            <div className="device-info">
              <div className="device-icon">💧</div>
              <div>
                <h3>Water Pump</h3>
                <p>Automatic irrigation</p>
              </div>
            </div>

            <span className="device-status">
              ● {data.waterPump ? "ON" : "OFF"}
            </span>
          </div>

          <div className={`device-card ${data.exhaustFan ? "active" : ""}`}>
            <div className="device-info">
              <div className="device-icon">🌀</div>
              <div>
                <h3>Exhaust Fan</h3>
                <p>Temperature control</p>
              </div>
            </div>

            <span className="device-status">
              ● {data.exhaustFan ? "ON" : "OFF"}
            </span>
          </div>

          <div className={`device-card ${data.growLight ? "active" : ""}`}>
            <div className="device-info">
              <div className="device-icon">💡</div>
              <div>
                <h3>Grow Light</h3>
                <p>Artificial lighting</p>
              </div>
            </div>

            <span className="device-status">
              ● {data.growLight ? "ON" : "OFF"}
            </span>
          </div>

          <div
            className={`device-card ${data.roof === "OPEN" ? "active" : ""}`}
          >
            <div className="device-info">
              <div className="device-icon">🏠</div>
              <div>
                <h3>Greenhouse Roof</h3>
                <p>Automatic roof control</p>
              </div>
            </div>

            <span className="device-status">● {data.roof}</span>
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
          <span>♧</span>
          <small>Activity</small>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;
