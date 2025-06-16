document.getElementById('search-btn').addEventListener('click', getWeather);
document.getElementById('location-btn').addEventListener('click', getLocationWeather);

function getWeather() {
    const city = document.getElementById('city-input').value;
    const apiKey = '61f10481d778f8bb181bb6ccd3b9862a';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('city-name').innerText = `City: ${data.name}`;
            document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
            document.getElementById('description').innerText = `Description: ${data.weather[0].description}`;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('City not found. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data not found');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Forecast data not found. Please try again.');
        });
}

function displayForecast(data) {
    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = ''; // Clear previous forecast data

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    data.list.forEach(item => {
        const itemDate = new Date(item.dt_txt);
        if (itemDate.getDate() === today.getDate() || itemDate.getDate() === tomorrow.getDate()) {
            const date = itemDate.toLocaleDateString();
            const time = itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temp = item.main.temp;
            const description = item.weather[0].description;

            const forecastItem = document.createElement('li');
            forecastItem.innerHTML = `<strong>${date} ${time}</strong><br>Temp: ${temp}°C<br>Description: ${description}`;
            forecastList.appendChild(forecastItem);
        }
    });
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '61f10481d778f8bb181bb6ccd3b9862a';
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetch(weatherUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Location weather data not found');
                    }
                    return response.json();
                })
                .then(data => {
                    document.getElementById('city-name').innerText = `City: ${data.name}`;
                    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
                    document.getElementById('description').innerText = `Description: ${data.weather[0].description}`;
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Location weather data not found. Please try again.');
                });

            fetch(forecastUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Location forecast data not found');
                    }
                    return response.json();
                })
                .then(data => {
                    displayForecast(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Location forecast data not found. Please try again.');
                });
        }, error => {
            console.error('Error:', error);
            alert('Unable to get your location. Please try again.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}