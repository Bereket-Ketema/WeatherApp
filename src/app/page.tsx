'use client'
import { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = "3a6ffcb3349a96ae8d3cfe8de45beef7"; // Your OpenWeatherMap API key

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city");
      setWeather(null);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setError(null);
      } else {
        setError("City not found!");
        setWeather(null);
      }
    } catch (err) {
      setError("Error fetching data");
      setWeather(null);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", marginTop: "50px" }}>
      <h1>🌤 Simple Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <button
        onClick={getWeather}
        style={{ padding: "10px 15px", marginLeft: "10px", cursor: "pointer" }}
      >
        Get Weather
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}
