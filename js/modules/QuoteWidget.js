import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || '💬 Случайные цитаты',
            id: config.id
        });
        this.quotes = config.quotes || [
            {
                text: "Единственный способ делать великие дела — любить то, что вы делаете.",
                author: "Стив Джобс"
            },
            {
                text: "Инновации отличают лидера от догоняющего.",
                author: "Стив Джобс"
            },
            {
                text: "Ваше время ограничено, не тратьте его, живя чужой жизнью.",
                author: "Стив Джобс"
            }
        ];
        this.currentQuote = this.getRandomQuote();
    }

    renderContent() {
        return `
            <div class="quote-widget">
                <div class="quote-content">
                    <p class="quote-text">"${this.currentQuote.text}"</p>
                    <p class="quote-author">— ${this.currentQuote.author}</p>
                </div>
                <button class="quote-refresh">🔄 Новая цитата</button>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        const refreshBtn = this.element.querySelector('.quote-refresh');
        refreshBtn.addEventListener('click', () => this.refreshQuote());
    }

    getRandomQuote() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    refreshQuote() {
        this.currentQuote = this.getRandomQuote();
        this.updateQuote();
    }

    updateQuote() {
        const quoteContent = this.element.querySelector('.quote-content');
        quoteContent.innerHTML = `
            <p class="quote-text">"${this.currentQuote.text}"</p>
            <p class="quote-author">— ${this.currentQuote.author}</p>
        `;
    }
}