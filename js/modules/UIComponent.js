export class UIComponent {
    constructor(config = {}) {
        this.id = config.id || `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.title = config.title || 'Виджет';
        this.element = null;
        this.isMinimized = false;
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'widget';
        this.element.id = this.id;
        
        this.element.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">${this.title}</h3>
                <div class="widget-controls">
                    <button class="control-btn minimize-btn" title="Свернуть">−</button>
                    <button class="control-btn close-btn" title="Закрыть">×</button>
                </div>
            </div>
            <div class="widget-content">
                ${this.renderContent()}
            </div>
        `;

        this.bindEvents();
        return this.element;
    }

    renderContent() {
        return '<p>Базовый контент виджета</p>';
    }

    bindEvents() {
        const minimizeBtn = this.element.querySelector('.minimize-btn');
        const closeBtn = this.element.querySelector('.close-btn');

        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        closeBtn.addEventListener('click', () => this.destroy());
    }

    toggleMinimize() {
        const content = this.element.querySelector('.widget-content');
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }

    update() {
        // Базовый метод обновления, может быть переопределен
        console.log(`Виджет ${this.id} обновлен`);
    }
}