const apiKey = "be0044d866dc49a6aca82103252705";

document.getElementById("weatherForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city!");
    return;
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

  try {
    const res = await axios.get(url);
    const data = res.data;
    console.log("Forecast Days:", data.forecast.forecastday.length); // Log number of days
    showCurrentWeather(data);
    showHourlyForecast(data.forecast.forecastday[0].hour);
    showForecast(data.forecast.forecastday);
    showAirConditions(data.current);
  } catch (err) {
    console.error("Error Details:", err.response ? err.response.data : err.message);
    alert("Failed to fetch weather. Please check the city name or API plan.");
  }
});

function showCurrentWeather(data) {
  const location = document.getElementById("location");
  const chanceOfRain = document.getElementById("chanceOfRain");
  const temperature = document.getElementById("temperature");
  const weatherIcon = document.getElementById("weatherIcon");

  location.textContent = `${data.location.name}, ${data.location.country}`;
  chanceOfRain.textContent = `Chance of rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
  temperature.textContent = `${Math.round(data.current.temp_c)}°C`;
  weatherIcon.src = `https:${data.current.condition.icon}`;
  weatherIcon.alt = data.current.condition.text;
  weatherIcon.classList.remove("hidden");
}

function showHourlyForecast(hours) {
  const hourlyDiv = document.getElementById("hourlyForecast");
  hourlyDiv.innerHTML = "";

  const times = ["6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];
  const hourIndices = [6, 9, 12, 15, 18, 21];

  hourIndices.forEach((hourIndex, index) => {
    const hour = hours[hourIndex];
    if (hour) {
      hourlyDiv.innerHTML += `
        <div class="hourly-item">
          <p>${times[index]}</p>
          <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" />
          <p>${Math.round(hour.temp_c)}°C</p>
        </div>
      `;
    }
  });
}

function showForecast(forecast) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";
  const maxDays = forecast.length; // Use actual number of days returned
  document.querySelector(".forecast-section-right h3").textContent = `${maxDays}-Day Forecast`; // Update header dynamically

  forecast.forEach((day, index) => {
    const date = new Date(day.date);
    const dayName = index === 0 ? "Today" : date.toLocaleString("en-US", { weekday: "short" });
    const icon = day.day.condition.icon;
    const text = day.day.condition.text;

    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <p>${dayName}</p>
        <img src="https:${icon}" alt="${text}" />
        <p>${text}</p>
        <p>${Math.round(day.day.maxtemp_c)}°/${Math.round(day.day.mintemp_c)}°</p>
      </div>
    `;
  });
}

function showAirConditions(data) {
  const airConditionsDiv = document.getElementById("airConditions");
  airConditionsDiv.innerHTML = `
    <div class="air-condition-item">
      <p>Real Feel</p>
      <p>${Math.round(data.feelslike_c)}°C</p>
    </div>
    <div class="air-condition-item">
      <p>Wind</p>
      <p>${data.wind_kph} km/h</p>
    </div>
    <div class="air-condition-item">
      <p>Humidity</p>
      <p>${data.humidity}%</p>
    </div>
    <div class="air-condition-item">
      <p>UV Index</p>
      <p>${data.uv}</p>
    </div>
  `;
}