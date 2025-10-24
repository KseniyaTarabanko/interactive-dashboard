import { Dashboard } from './modules/Dashboard.js';
import { ToDoWidget } from './modules/ToDoWidget.js';
import { QuoteWidget } from './modules/QuoteWidget.js';
import { WeatherWidget } from './modules/WeatherWidget.js';
import { CryptoWidget } from './modules/CryptoWidget.js';

class App {
    constructor() {
        this.dashboard = new Dashboard('dashboard');
        this.init();
    }

    init() {
        this.bindEvents();
        this.addSampleWidgets();
    }

    bindEvents() {
        document.getElementById('addTodo').addEventListener('click', () => {
            this.dashboard.addWidget(ToDoWidget, {
                title: '📝 Мои задачи',
                tasks: [
                    { text: 'Изучить JavaScript', completed: true },
                    { text: 'Создать панель управления', completed: false },
                    { text: 'Выгрузить на GitHub', completed: false }
                ]
            });
        });

        document.getElementById('addQuote').addEventListener('click', () => {
            this.dashboard.addWidget(QuoteWidget, {
                title: '💬 Вдохновляющие цитаты'
            });
        });

        document.getElementById('addWeather').addEventListener('click', () => {
            const weatherWidget = this.dashboard.addWidget(WeatherWidget, {
                title: '🌤️ Погода в Москве',
                city: 'Moscow'
            });
            if (weatherWidget) {
                weatherWidget.update();
            }
        });

        document.getElementById('addCrypto').addEventListener('click', () => {
            const cryptoWidget = this.dashboard.addWidget(CryptoWidget, {
                title: '💰 Bitcoin',
                cryptoId: 'bitcoin'
            });
            if (cryptoWidget) {
                cryptoWidget.update();
            }
        });
    }

    addSampleWidgets() {
        // Добавляем несколько виджетов при загрузке для демонстрации
        this.dashboard.addWidget(ToDoWidget, {
            title: '📝 Мои задачи',
            tasks: [
                { text: 'Изучить JavaScript', completed: true },
                { text: 'Создать панель управления', completed: false },
                { text: 'Выгрузить на GitHub', completed: false }
            ]
        });

        this.dashboard.addWidget(QuoteWidget, {
            title: '💬 Вдохновляющие цитаты'
        });
    }
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new App();
});