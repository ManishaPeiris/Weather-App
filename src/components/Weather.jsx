import React, { useEffect, useState, useRef } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'

const Weather = () => {
  const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(false);

  // Temperature-based icon logic
  const getIconByTemp = (temp) => {
    if (temp <= 5) {
      return snow_icon;
    } else if (temp > 5 && temp <= 20) {
      return cloud_icon;
    } else if (temp > 20 && temp <= 30) {
      return clear_icon;
    } else {
      return drizzle_icon; // hot climate -> drizzle/sunny variant
    }
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      console.log(data);
      const temperature = Math.floor(data.main.temp);
      const icon = getIconByTemp(temperature);

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: temperature,
        location: data.name,
        icon: icon
      })
    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data", error);
    }
  };

  useEffect(() => {
    search("Colombo"); // Default city
  }, []);

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='search' />
        <img src={search_icon} alt="search" onClick={() => search(inputRef.current.value)} />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="weather" className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°c</p>
          <p className='location'>{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Weather
