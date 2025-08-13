'use client';
import { useState, useEffect } from "react";

type WeatherData = {
  name: string;
  sys: {
    country: string;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
  };
};

type ForecastItem = {
  dt_txt: string;
  weather: {
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
  };
};


export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);

  const [error, setError] = useState<string | null>(null);


  const apiKey = "3a6ffcb3349a96ae8d3cfe8de45beef7"; // Your API key
  // ✅ Auto-detect user's location on first load
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const weatherData = await weatherRes.json();

        if (weatherData.cod === 200) {
          setWeather(weatherData);

          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          const forecastData = await forecastRes.json();

         const dailyForecast = forecastData.list.filter((item: ForecastItem) =>
        item.dt_txt.includes("12:00:00")
      );
          setForecast(dailyForecast);
        }
      } catch (err) {
        console.error("Error fetching location weather:", err);
      }
    });
  }
}, []);


  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city");
      setWeather(null);
      setForecast([]);
      return;
    }

    try {
      // Fetch current weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherRes.json();

      if (weatherData.cod === 200) {
        setWeather(weatherData);
        setError(null);

        // Fetch 5-day forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const forecastData = await forecastRes.json();

        // Pick 1 forecast per day (at 12:00 PM)
        const dailyForecast = forecastData.list.filter((item: ForecastItem) =>
        item.dt_txt.includes("12:00:00")
      );

        setForecast(dailyForecast);
      } else {
        setError("City not found!");
        setWeather(null);
        setForecast([]);
      }
    } catch (err) {
      setError("Error fetching data");
      setWeather(null);
      setForecast([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-indigo-700 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">🌤 Weather App</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="px-4 py-2 rounded-lg text-black outline-none"
        />
        <button
          onClick={getWeather}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
        >
          Get Weather
        </button>
      </div>

      {error && <p className="text-red-300">{error}</p>}

      {weather && (
        <div className="bg-white text-black rounded-lg p-6 w-80 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-center">
            {weather.name}, {weather.sys.country}
          </h2>
          <div className="flex flex-col items-center">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
              className="my-2"
            />
            <p className="text-xl">Temperature: {weather.main.temp}°C</p>
            <p className="capitalize">{weather.weather[0].description}</p>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="w-full max-w-4xl">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            5-Day Forecast
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="bg-white text-black rounded-lg p-4 flex flex-col items-center shadow-md"
              >
                <p className="font-medium">
                  {new Date(day.dt_txt).toLocaleDateString()}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <p>{day.main.temp}°C</p>
                <p className="capitalize text-sm">
                  {day.weather[0].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
