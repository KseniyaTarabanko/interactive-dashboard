import { UIComponent } from './UIComponent.js';

export class CryptoWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || '💰 Криптовалюта',
            id: config.id
        });
        this.cryptoId = config.cryptoId || 'bitcoin';
        this.cryptoData = null;
    }

    renderContent() {
        if (!this.cryptoData) {
            return `
                <div class="crypto-content">
                    <p>Загрузка данных...</p>
                </div>
            `;
        }

        const price = this.cryptoData.priceUsd;
        const change = this.cryptoData.changePercent24Hr;
        const isPositive = parseFloat(change) >= 0;

        return `
            <div class="crypto-content">
                <div class="crypto-name">${this.cryptoData.name} (${this.cryptoData.symbol})</div>
                <div class="crypto-price">$${parseFloat(price).toFixed(2)}</div>
                <div class="crypto-change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '↗' : '↘'} ${Math.abs(parseFloat(change)).toFixed(2)}%
                </div>
                <button class="crypto-refresh">🔄 Обновить</button>
            </div>
        `;
    }

    async fetchCryptoData() {
        try {
            // Используем CoinCap API (бесплатный, не требует ключа)
            const response = await fetch(
                `https://api.coincap.io/v2/assets/${this.cryptoId}`
            );
            
            if (!response.ok) {
                throw new Error('Ошибка получения данных о криптовалюте');
            }
            
            const data = await response.json();
            this.cryptoData = data.data;
            this.update();
        } catch (error) {
            console.error('Ошибка:', error);
            // Заглушка для демонстрации
            this.cryptoData = {
                name: 'Bitcoin',
                symbol: 'BTC',
                priceUsd: '45000.00',
                changePercent24Hr: '2.5'
            };
            this.update();
        }
    }

    bindEvents() {
        super.bindEvents();
        
        const refreshBtn = this.element.querySelector('.crypto-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.update());
        }
    }

    async update() {
        await this.fetchCryptoData();
        const content = this.element.querySelector('.widget-content');
        content.innerHTML = this.renderContent();
        this.bindEvents();
    }
}