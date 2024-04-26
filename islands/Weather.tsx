import { useEffect, useState } from "preact/hooks";
import { FunctionComponent } from "preact";
import { WeatherData } from "../types.ts";

const Weather: FunctionComponent = () => {
  const cities = [
    { name: "Madrid", latitude: 40.4168, longitude: -3.7038 },
    { name: "Seville", latitude: 37.3891, longitude: -5.9845 },
    { name: "Malaga", latitude: 36.7196, longitude: -4.4200 },
    { name: "Barcelona", latitude: 41.3851, longitude: 2.1734 },
    { name: "Valencia", latitude: 39.4699, longitude: -0.3763 },
  ];

  const [city, setCity] = useState(cities[0]);
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [checkboxData, SetCheckboxData] = useState({
    time: true,
    temperature_2m: true,
    relative_humidity_2m: true,
    precipitation: true,
    rain: true,
    wind_speed_10m: true,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const fetchResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m`,
        );
        const fetchResponseJSON = await fetchResponse.json();
        
        const reducedTime = new Date(fetchResponseJSON.current.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

        const data: WeatherData = {
          time: reducedTime,
          temperature_2m: fetchResponseJSON.current.temperature_2m,
          relative_humidity_2m: fetchResponseJSON.current.relative_humidity_2m,
          precipitation: fetchResponseJSON.current.precipitation,
          rain: fetchResponseJSON.current.rain,
          wind_speed_10m: fetchResponseJSON.current.wind_speed_10m,
        };

        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data from API - ", error);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div>
      <h1>CURRENT WEATHER FORECAST</h1>
      <h2>{city.name}</h2>
      <div class="flex-column">
        <p>Choose a city from the next dropdown to see the current weather forecast:</p>
        <select
        value={city.name}
        onChange={(e) => {
          const newName = e.currentTarget.value;
          const newCity = cities.find((city) => city.name === newName);
          if (newCity) setCity(newCity);
        }}
      >
        {cities.map((city) => <option value={city.name}>{city.name}</option>)}
      </select>
      </div>
      
      

      <div class="optionsWeather">
        <p>Choose the options that will be displayed:</p>
        <label>
          <input
            type="checkbox"
            checked={checkboxData.time}
            onChange={() =>
              SetCheckboxData({ ...checkboxData, time: !checkboxData.time })}
          />{" "}
          Show time
        </label>

        <label>
          <input
            type="checkbox"
            checked={checkboxData.temperature_2m}
            onChange={() =>
              SetCheckboxData({ ...checkboxData, temperature_2m: !checkboxData.temperature_2m})}
          />{" "}
          Show temperature
        </label>

        <label>
          <input
            type="checkbox"
            checked={checkboxData.relative_humidity_2m}
            onChange={() =>
              SetCheckboxData({ ...checkboxData, relative_humidity_2m: !checkboxData.relative_humidity_2m})}
          />{" "}
          Show relative humidity
        </label>

        <label>
          <input
            type="checkbox"
            checked={checkboxData.precipitation}
            onChange={() =>
              SetCheckboxData({ ...checkboxData, precipitation: !checkboxData.precipitation})}
          />{" "}
          Show time
        </label>

        <label>
          <input
            type="checkbox"
            checked={checkboxData.rain}
            onChange={() =>
              SetCheckboxData({ ...checkboxData, rain: !checkboxData.rain})}
          />{" "}
          Show rain
        </label>

        <label>
          <input
            type="checkbox"
            checked={checkboxData.wind_speed_10m}
            onChange={() =>
              SetCheckboxData({ ...checkboxData, wind_speed_10m: !checkboxData.wind_speed_10m })}
          />{" "}
          Show wind speed
        </label>
      </div>

      {weatherData && (
        <div class="weatherData">
          {checkboxData.time && <p>Time: {weatherData.time}</p>}
          {checkboxData.temperature_2m &&<p>Temperature: {weatherData.temperature_2m + " ºC"}</p>}
          {checkboxData.relative_humidity_2m &&<p>Relative Humidity: {weatherData.relative_humidity_2m + " %"}</p>}
          {checkboxData.precipitation &&<p>Precipitation: {weatherData.precipitation + " mm"}</p>}
          {checkboxData.rain &&<p>Rain: {weatherData.rain + " mm"}</p>}
          {checkboxData.wind_speed_10m &&<p>Wind Speed: {weatherData.wind_speed_10m + " km/h"}</p>}
        </div>
      )}
    </div>
  );
};

export default Weather;
