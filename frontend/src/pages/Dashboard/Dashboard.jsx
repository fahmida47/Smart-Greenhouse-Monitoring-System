import { useCallback, useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://192.168.0.10:8000/api/greenhouse/status";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchGreenhouseData = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}?t=${Date.now()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      console.log("API Status:", response.status);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();

      console.log("FULL API RESULT:", result);
      console.log("SENSOR DATA:", result.data);

      if (result.data) {
        setData(result.data);
        setLastUpdated(new Date());
        setError("");
      } else {
        throw new Error("API response does not contain sensor data.");
      }
    } catch (err) {
      console.error("Greenhouse API Error:", err);

      setError(err.message || "Unable to connect to greenhouse server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGreenhouseData();

    const interval = setInterval(() => {
      fetchGreenhouseData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchGreenhouseData]);

  /* ---------------- LOADING ---------------- */

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

  /* ---------------- ERROR ---------------- */

  if (error && !data) {
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

  /* ---------------- SAFETY ---------------- */

  if (!data) {
    return (
      <div className="greenhouse-app dashboard-loading">
        <div className="loading-card">
          <div className="empty-icon">🌱</div>

          <h2>Waiting for Sensor Data</h2>

          <p>Waiting for the greenhouse sensor to provide data.</p>

          <button onClick={fetchGreenhouseData}>Refresh</button>
        </div>
      </div>
    );
  }

  const environmentHealth = calculateHealth(data);

  return (
    <div className="greenhouse-app">
      {/* ================= HEADER ================= */}

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

      {/* ================= CONNECTION WARNING ================= */}

      {error && data && (
        <div className="connection-warning">
          ⚠️ Connection temporarily unavailable. Showing latest sensor data.
        </div>
      )}

      {/* ================= HEALTH ================= */}

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

      {/* ================= ENVIRONMENT ================= */}

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Environment</h2>

          <span>Live Data</span>
        </div>

        <div className="sensor-grid">
          {/* TEMPERATURE */}

          <div className="sensor-card">
            <div className="sensor-icon temperature">🌡️</div>

            <p>Temperature</p>

            <strong>{data.temperature}°C</strong>

            <span className="sensor-status">● Normal</span>
          </div>

          {/* HUMIDITY */}

          <div className="sensor-card">
            <div className="sensor-icon humidity">💧</div>

            <p>Humidity</p>

            <strong>{data.humidity}%</strong>

            <span className="sensor-status">● Normal</span>
          </div>

          {/* SOIL MOISTURE */}

          <div className="sensor-card">
            <div className="sensor-icon soil">🌱</div>

            <p>Soil Moisture</p>

            <strong>{data.soil_moisture}%</strong>

            <span className="sensor-status">● Good</span>
          </div>

          {/* LIGHT */}

          <div className="sensor-card">
            <div className="sensor-icon light">☀️</div>

            <p>Light Intensity</p>

            <strong>{data.light_intensity}%</strong>

            <span className="sensor-status">● Good</span>
          </div>
        </div>
      </section>

      {/* ================= WEATHER ================= */}

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

      {/* ================= AUTOMATIC SYSTEM ================= */}

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Automatic System</h2>

          <span>Hardware Output</span>
        </div>

        <div className="device-list">
          <Device
            icon="💧"
            title="Water Pump"
            description="Automatic irrigation"
            active={Boolean(data.water_pump)}
            status={data.water_pump ? "ON" : "OFF"}
          />

          <Device
            icon="🌀"
            title="Exhaust Fan"
            description="Temperature control"
            active={Boolean(data.exhaust_fan)}
            status={data.exhaust_fan ? "ON" : "OFF"}
          />

          <Device
            icon="💡"
            title="Grow Light"
            description="Artificial lighting"
            active={Boolean(data.grow_light)}
            status={data.grow_light ? "ON" : "OFF"}
          />

          <Device
            icon="🏠"
            title="Greenhouse Roof"
            description="Automatic roof control"
            active={data.roof_status === "OPEN"}
            status={data.roof_status || "UNKNOWN"}
          />
        </div>
      </section>

      {/* ================= LAST UPDATED ================= */}

      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* ================= BOTTOM NAV ================= */}

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

/* ================= DEVICE ================= */

function Device({ icon, title, description, active, status }) {
  return (
    <div className={`device-card ${active ? "active" : ""}`}>
      <div className="device-info">
        <div className="device-icon">{icon}</div>

        <div>
          <h3>{title}</h3>

          <p>{description}</p>
        </div>
      </div>

      <span className="device-status">● {status}</span>
    </div>
  );
}

/* ================= HEALTH ================= */

function calculateHealth(data) {
  let score = 100;

  const temperature = Number(data.temperature);

  const humidity = Number(data.humidity);

  const soilMoisture = Number(data.soil_moisture);

  if (temperature > 32) {
    score -= 20;
  }

  if (temperature < 15) {
    score -= 15;
  }

  if (humidity < 40) {
    score -= 15;
  }

  if (humidity > 85) {
    score -= 15;
  }

  if (soilMoisture < 30) {
    score -= 20;
  }

  if (data.rain_detected) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

export default Dashboard;
