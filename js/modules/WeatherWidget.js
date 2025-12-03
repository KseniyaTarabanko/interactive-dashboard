import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || '🌤️ Погода',
            id: config.id
        });
        this.city = config.city || 'Moscow';
        this.weatherData = null;
        // Координаты для разных городов
        this.cityCoordinates = {
            'Moscow': { lat: 55.7558, lon: 37.6176 },
            'London': { lat: 51.5074, lon: -0.1278 },
            'New York': { lat: 40.7128, lon: -74.0060 },
            'Tokyo': { lat: 35.6762, lon: 139.6503 },
            'Paris': { lat: 48.8566, lon: 2.3522 },
            'Berlin': { lat: 52.5200, lon: 13.4050 }
        };
    }

    renderContent() {
        if (!this.weatherData) {
            return `
                <div class="weather-content">
                    <p>Загрузка погоды...</p>
                </div>
            `;
        }

        // Проверяем, есть ли ошибка
        if (this.weatherData.error) {
            return `
                <div class="weather-content">
                    <p style="color: red;">Ошибка: ${this.weatherData.error}</p>
                    <p>Используются демо-данные</p>
                    <div class="weather-icon">⛅</div>
                    <div class="weather-temp">20°C</div>
                    <div class="weather-desc">ясно</div>
                </div>
            `;
        }

        return `
            <div class="weather-content">
                <div class="weather-header">
                    <div class="weather-city">${this.weatherData.name}</div>
                </div>
                <div class="weather-icon">${this.getWeatherIcon()}</div>
                <div class="weather-temp">${Math.round(this.weatherData.main.temp)}°C</div>
                <div class="weather-desc">${this.capitalizeFirstLetter(this.weatherData.weather[0].description)}</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <strong>Ощущается</strong>
                        <div>${Math.round(this.weatherData.main.feels_like)}°C</div>
                    </div>
                    <div class="weather-detail">
                        <strong>Влажность</strong>
                        <div>${this.weatherData.main.humidity}%</div>
                    </div>
                    <div class="weather-detail">
                        <strong>Ветер</strong>
                        <div>${this.weatherData.wind.speed} м/с</div>
                    </div>
                </div>
            </div>
        `;
    }

    async fetchWeather() {
        try {
            const coords = this.cityCoordinates[this.city] || this.cityCoordinates['Moscow'];
            
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m&timezone=auto`
            );
            
            if (!response.ok) {
                throw new Error('Ошибка подключения к сервису погоды');
            }
            
            const data = await response.json();
            
            this.weatherData = {
                name: this.city,
                main: {
                    temp: data.current_weather.temperature,
                    feels_like: data.current_weather.temperature,
                    humidity: this.getAverageHumidity(data.hourly)
                },
                weather: [{ 
                    description: this.getWeatherDescription(data.current_weather.weathercode),
                    main: this.getWeatherMain(data.current_weather.weathercode)
                }],
                wind: { 
                    speed: data.current_weather.windspeed 
                }
            };
            
        } catch (error) {
            console.error('Ошибка получения погоды:', error);
            this.weatherData = {
                error: error.message,
                name: this.city,
                main: { temp: 20, feels_like: 19, humidity: 65 },
                weather: [{ description: 'демо-режим', main: 'Clear' }],
                wind: { speed: 3 }
            };
        }
    }

    getAverageHumidity(hourlyData) {
        if (!hourlyData || !hourlyData.relativehumidity_2m) return 65;
        const humidities = hourlyData.relativehumidity_2m.slice(0, 12); // Берем ближайшие 12 часов
        const sum = humidities.reduce((a, b) => a + b, 0);
        return Math.round(sum / humidities.length);
    }

    getWeatherDescription(code) {
        const descriptions = {
            0: 'ясно', 1: 'преимущественно ясно', 2: 'переменная облачность',
            3: 'пасмурно', 45: 'туман', 48: 'изморозь', 51: 'легкая морось',
            53: 'умеренная морось', 55: 'сильная морось', 56: 'легкая ледяная морось',
            57: 'сильная ледяная морось', 61: 'небольшой дождь', 63: 'умеренный дождь',
            65: 'сильный дождь', 66: 'легкий ледяной дождь', 67: 'сильный ледяной дождь',
            71: 'небольшой снег', 73: 'умеренный снег', 75: 'сильный снег',
            77: 'снежные зерна', 80: 'небольшие ливни', 81: 'умеренные ливни',
            82: 'сильные ливни', 85: 'небольшие снегопады', 86: 'сильные снегопады',
            95: 'гроза', 96: 'гроза с небольшим градом', 99: 'гроза с сильным градом'
        };
        return descriptions[code] || 'переменная облачность';
    }

    getWeatherMain(code) {
        if (code === 0) return 'Clear';
        if (code >= 1 && code <= 3) return 'Clouds';
        if (code >= 45 && code <= 48) return 'Mist';
        if (code >= 51 && code <= 67) return 'Rain';
        if (code >= 71 && code <= 77) return 'Snow';
        if (code >= 80 && code <= 82) return 'Rain';
        if (code >= 85 && code <= 86) return 'Snow';
        if (code >= 95 && code <= 99) return 'Thunderstorm';
        return 'Clear';
    }

    getWeatherIcon() {
        if (!this.weatherData || this.weatherData.error) return '⛅';
        
        const main = this.weatherData.weather[0].main.toLowerCase();
        const icons = {
            'clear': '☀️',
            'clouds': '☁️',
            'rain': '🌧️',
            'drizzle': '🌦️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️',
            'fog': '🌫️'
        };
        
        return icons[main] || '⛅';
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async update() {
        await this.fetchWeather();
        if (this.element) {
            const content = this.element.querySelector('.widget-content');
            if (content) {
                content.innerHTML = this.renderContent();
            }
        }
    }

    // Метод для смены города
    setCity(city) {
        if (this.cityCoordinates[city]) {
            this.city = city;
            this.update();
        } else {
            console.warn(`Город ${city} не поддерживается. Доступные города: ${Object.keys(this.cityCoordinates).join(', ')}`);
        }
    }
}