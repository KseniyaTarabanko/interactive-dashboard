import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || '🌤️ Погода',
            id: config.id
        });
        this.city = config.city || 'Moscow';
        this.weatherData = null;
    }

    renderContent() {
        if (!this.weatherData) {
            return `
                <div class="weather-content">
                    <p>Загрузка погоды...</p>
                </div>
            `;
        }

        return `
            <div class="weather-content">
                <div class="weather-icon">${this.getWeatherIcon()}</div>
                <div class="weather-temp">${Math.round(this.weatherData.main.temp)}°C</div>
                <div class="weather-desc">${this.weatherData.weather[0].description}</div>
                <div class="weather-details">
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
            // Используем OpenWeatherMap API (бесплатный ключ)
            const API_KEY = 'your_api_key_here'; // Замените на реальный ключ
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${API_KEY}&lang=ru`
            );
            
            if (!response.ok) {
                throw new Error('Ошибка получения данных о погоде');
            }
            
            this.weatherData = await response.json();
            this.update();
        } catch (error) {
            console.error('Ошибка:', error);
            this.weatherData = {
                main: { temp: 20, humidity: 65 },
                weather: [{ description: 'ясно' }],
                wind: { speed: 3 }
            };
            this.update();
        }
    }

    getWeatherIcon() {
        if (!this.weatherData) return '⛅';
        
        const main = this.weatherData.weather[0].main.toLowerCase();
        const icons = {
            'clear': '☀️',
            'clouds': '☁️',
            'rain': '🌧️',
            'drizzle': '🌦️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️'
        };
        
        return icons[main] || '⛅';
    }

    async update() {
        await this.fetchWeather();
        const content = this.element.querySelector('.widget-content');
        content.innerHTML = this.renderContent();
    }
}